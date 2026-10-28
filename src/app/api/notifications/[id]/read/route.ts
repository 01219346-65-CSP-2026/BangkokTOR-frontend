import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authedFetch } from "@/api/client";
import type { BackendNotification } from "@/api/notifications";
import { notificationFailure } from "../../shared";

// Marks one of the signed-in reader's own notifications read, proxied to the
// backend's `/api/me/notifications/:id/read`. The backend scopes the update
// to the token's user — someone else's id answers 404 there, not 403, so it
// never confirms whether an id exists.

type Context = { params: Promise<{ id: string }> };

// Only an object id reaches the backend path — never a "../" someone typed.
const NOTIFICATION_ID = /^[a-f0-9]{24}$/i;

export async function PATCH(_request: Request, context: Context) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { id } = await context.params;
  if (!NOTIFICATION_ID.test(id)) {
    return NextResponse.json({ error: "Invalid notification id" }, { status: 400 });
  }

  try {
    const data = await authedFetch<BackendNotification>(`/api/me/notifications/${id}/read`, {
      method: "PATCH",
    });
    return NextResponse.json(data);
  } catch (error) {
    return notificationFailure(error, "Could not mark that notification read.");
  }
}
