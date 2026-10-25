import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS, DEMO_PERSONNEL } from '@/lib/mock-data/fixtures';
import { PersonnelDirectory } from '@/app/(engineer)/components/PersonnelDirectory';

export const metadata = {
  title: 'Team Directory | Civora Control Plane',
};

export default async function PersonnelPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;

  return (
    <PersonnelDirectory
      user={user}
      initialPersonnel={DEMO_PERSONNEL}
    />
  );
}
