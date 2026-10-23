import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS, DEMO_TASKS, DEMO_ACTIVITIES } from '@/lib/mock-data/fixtures';
import { ActivityTasks } from '@/features/activity/components/ActivityTasks';

export const metadata = {
  title: 'Tasks & Engineering Actions | Civora Control Plane',
};

export default async function ProjectTasksPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;

  return (
    <ActivityTasks
      user={user}
      initialTasks={DEMO_TASKS}
      initialActivities={DEMO_ACTIVITIES}
    />
  );
}
