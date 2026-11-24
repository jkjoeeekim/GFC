import { Navigate, Route, Routes } from 'react-router-dom'
import { AccountProvider } from '../../account/AccountProvider'
import { SignIn } from './SignIn'
import { Profile } from './Profile'
import { Admin } from './Admin'

/** Lazily loaded so public pages never download the sign-in code. */
export default function AccountArea() {
  return <AccountProvider><Routes>
    <Route index element={<Profile />} />
    <Route path="sign-in" element={<SignIn />} />
    <Route path="admin" element={<Admin />} />
    <Route path="*" element={<Navigate to="/account" replace />} />
  </Routes></AccountProvider>
}
