import React from 'react';
import { getCurrentUser, getServerTasksAndActivities } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { ActivityTasks } from '@/app/(engineer)/components/ActivityTasks';

export const metadata = {
  title: 'Tasks & Engineering Actions | Civora Control Plane',
};

export default async function ProjectTasksPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;
  const { tasks, activities } = await getServerTasksAndActivities();

  return (
    <ActivityTasks
      user={user}
      initialTasks={tasks}
      initialActivities={activities}
    />
  );
}
