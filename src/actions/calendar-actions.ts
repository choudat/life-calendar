'use server';

import { db } from '@/db';
import { calendars } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { NewCalendar, Calendar } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';

export async function createCalendarAction(data: Omit<NewCalendar, 'userId'>) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

    try {
        const calendarWithUser = {
            ...data,
            userId,
        };
        const [inserted] = await db.insert(calendars).values(calendarWithUser).returning();
        revalidatePath('/app');
        return { success: true, data: inserted };
    } catch (error) {
        console.error('Failed to create calendar:', error);
        return { success: false, error: 'Failed to create calendar' };
    }
}

export async function updateCalendarAction(id: string, data: Partial<NewCalendar>) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

    try {
        const [updated] = await db.update(calendars)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(calendars.id, id), eq(calendars.userId, userId)))
            .returning();
        
        if (!updated) return { success: false, error: 'Calendar not found or unauthorized' };
            
        revalidatePath('/app');
        return { success: true, data: updated };
    } catch (error) {
        console.error('Failed to update calendar:', error);
        return { success: false, error: 'Failed to update calendar' };
    }
}

export async function deleteCalendarAction(id: string) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

    try {
        const deleted = await db.delete(calendars)
            .where(and(eq(calendars.id, id), eq(calendars.userId, userId)))
            .returning();

        if (deleted.length === 0) return { success: false, error: 'Calendar not found or unauthorized' };

        revalidatePath('/app');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete calendar:', error);
        return { success: false, error: 'Failed to delete calendar' };
    }
}

export async function getCalendarsAction() {
    const { userId } = await auth();
    if (!userId) return { success: true, data: [] };

    try {
        const result = await db.select()
            .from(calendars)
            .where(eq(calendars.userId, userId))
            .orderBy(asc(calendars.position), asc(calendars.createdAt)); // Stable sort
            
        return { success: true, data: result };
    } catch (error) {
        console.error('Failed to fetch calendars:', error);
        return { success: false, error: 'Failed to fetch calendars' };
    }
}

export async function reorderCalendarsAction(updates: { id: string, position: number }[]) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

    try {
        // Use Promise.all for parallel updates. 
        // Note: For large lists this might hit connection limits, but for <20 calendars it's fine.
        await Promise.all(
            updates.map(update => 
                db.update(calendars)
                    .set({ position: update.position })
                    .where(and(eq(calendars.id, update.id), eq(calendars.userId, userId)))
            )
        );
        
        revalidatePath('/app');
        return { success: true };
    } catch (error) {
        console.error('Failed to reorder calendars:', error);
        return { success: false, error: 'Failed to reorder calendars' };
    }
}
