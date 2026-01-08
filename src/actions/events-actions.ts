'use server';

import { db } from '@/db';
import { events } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { NewEvent, Event } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';

// Helper to serialize dates for client
const serializeEvent = (event: typeof events.$inferSelect) => ({
    ...event,
    startDate: new Date(event.startDate), 
    endDate: event.endDate ? new Date(event.endDate) : undefined,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
});

export async function createEventAction(data: Omit<NewEvent, 'userId'>) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

    try {
        const eventWithUser = {
            ...data,
            userId,
        };
        const [inserted] = await db.insert(events).values(eventWithUser).returning();
        revalidatePath('/app');
        return { success: true, data: serializeEvent(inserted) };
    } catch (error) {
        console.error('Failed to create event:', error);
        return { success: false, error: 'Failed to create event' };
    }
}

export async function updateEventAction(id: string, data: Partial<NewEvent>) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

    try {
        const [updated] = await db.update(events)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(events.id, id), eq(events.userId, userId)))
            .returning();
        
        if (!updated) return { success: false, error: 'Event not found or unauthorized' };
            
        revalidatePath('/app');
        return { success: true, data: serializeEvent(updated) };
    } catch (error) {
        console.error('Failed to update event:', error);
        return { success: false, error: 'Failed to update event' };
    }
}

export async function deleteEventAction(id: string) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

    try {
        const deleted = await db.delete(events)
            .where(and(eq(events.id, id), eq(events.userId, userId)))
            .returning();

        if (deleted.length === 0) return { success: false, error: 'Event not found or unauthorized' };

        revalidatePath('/app');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete event:', error);
        return { success: false, error: 'Failed to delete event' };
    }
}

export async function getEventsAction() {
    const { userId } = await auth();
    if (!userId) return { success: true, data: [] }; // Return empty for guests

    try {
        const result = await db.select().from(events).where(eq(events.userId, userId));
        return { success: true, data: result.map(serializeEvent) };
    } catch (error) {
        console.error('Failed to fetch events:', error);
        return { success: false, error: 'Failed to fetch events' };
    }
}
