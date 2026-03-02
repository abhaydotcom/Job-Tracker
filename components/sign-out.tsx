import React from 'react'
import { DropdownMenuItem } from './ui/dropdown-menu';
import { signOut } from '@/lib/Auth/auth-client';
import { useRouter } from 'next/navigation';

function SignOut() {

    const router=useRouter();
  return (
    <DropdownMenuItem
      onClick={async () => {
        const result = await signOut();
        if (result.data) {
          router.push("/sign-in");
        } else {
          alert("Error signing out");
        }
      }}
    >
      Log Out
    </DropdownMenuItem>
  )
}

export default SignOut