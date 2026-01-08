"use client";

import { useState, useEffect } from "react";

export default function RootStructure({
    children,
    lang,
    bodyClassName,
}: {
    children: React.ReactNode;
    lang: string;
    bodyClassName: string;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <html lang={lang} suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              (function() {
                const html = document.documentElement;
                const body = document.body;
                
                // Clean HTML attributes (keep only lang)
                for (const attr of [...html.attributes]) {
                  if (attr.name !== 'lang') html.removeAttribute(attr.name);
                }
                
                // Clean Body attributes (keep only class)
                for (const attr of [...body.attributes]) {
                  if (attr.name !== 'class') body.removeAttribute(attr.name);
                }
              })();
            `,
                    }}
                />
            </head>
            <body className={bodyClassName} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
