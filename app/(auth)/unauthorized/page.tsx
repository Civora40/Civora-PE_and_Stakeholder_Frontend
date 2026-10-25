import { ShieldAlert, RotateCcw, Home } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/session';
import { ROLE_LABELS } from '@/lib/permissions/rbac';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CivoraLogo } from '@/components/brand/CivoraLogo';

export default async function UnauthorizedPage() {
  const user = await getCurrentUser();
  const roleInfo = user ? ROLE_LABELS[user.role] : null;

  return (
    <div className="min-h-screen bg-[#001237] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-4">
        <CivoraLogo size="md" showTagline={true} href="/" theme="dark" className="justify-center" />

        <div className="rounded-2xl bg-[#18243D]/90 border border-rose-500/40 p-8 shadow-2xl backdrop-blur-md space-y-6 mt-6">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="rose" size="md">
              Access Restricted (403 Forbidden)
            </Badge>
            <h1 className="text-2xl font-black text-white font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Insufficient Role Permissions
            </h1>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Your active session credentials do not permit access to this module or operation.
            </p>
          </div>

          {user && roleInfo && (
            <div className="rounded-xl bg-[#001237] border border-slate-700/80 p-4 text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current User:</span>
                <span className="font-semibold text-white">{user.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assigned Role:</span>
                <Badge variant="blue" size="sm">
                  {roleInfo.title}
                </Badge>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                {roleInfo.description}
              </div>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              href="/dashboard"
              variant="teal"
              size="md"
              leftIcon={<Home className="w-4 h-4" />}
              className="w-full sm:w-auto justify-center"
            >
              Back to Overview
            </Button>
            <Button
              href="/dashboard/settings"
              variant="outline"
              size="md"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              className="w-full sm:w-auto justify-center"
            >
              Role Matrix
            </Button>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            Need elevated clearance? Contact your enterprise platform administrator or switch
            personas via the role switcher.
          </div>
        </div>
      </div>
    </div>
  );
}
