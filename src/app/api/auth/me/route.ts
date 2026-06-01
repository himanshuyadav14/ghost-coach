import { withAuth } from "@/lib/api/handler";
import { success } from "@/lib/api/response";
import { getUserProfile } from "@/lib/auth/auth.service";

export const GET = withAuth(async (_request, session) => {
  const skillLevel = await getUserProfile(session.id);

  return success({
    ...session,
    ...(skillLevel ? { skillLevel } : {}),
  });
});
