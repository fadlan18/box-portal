interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  isAdmin: boolean
}

interface AuthState {
  user: AuthUser | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
}

export function useCustomAuth() {
  const authState = useState<AuthState>('auth', () => ({
    user: null,
    status: 'loading'
  }))

  const user = computed(() => authState.value.user)
  const status = computed(() => authState.value.status)
  const isAdmin = computed(() => authState.value.user?.role === 'admin')

  async function fetchUser() {
    try {
      // Kirim cookie headers saat SSR (hard refresh)
      const headers = useRequestHeaders(['cookie'])
      const res = await $fetch<any>('/api/auth/me', {
        credentials: 'include',
        headers,
      })
      if (res?.ok && res?.user) {
        authState.value = { user: res.user, status: 'authenticated' }
      } else {
        authState.value = { user: null, status: 'unauthenticated' }
      }
    } catch {
      authState.value = { user: null, status: 'unauthenticated' }
    }
  }

  async function login(email: string, password: string) {
    const res = await $fetch<any>('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })
    if (res?.ok && res?.user) {
      authState.value = { user: res.user, status: 'authenticated' }
    }
    return res
  }

  async function register(email: string, password: string, name: string) {
    const res = await $fetch<any>('/api/auth/register', {
      method: 'POST',
      body: { email, password, name }
    })
    if (res?.ok && res?.user) {
      authState.value = { user: res.user, status: 'authenticated' }
    }
    return res
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    authState.value = { user: null, status: 'unauthenticated' }
    await navigateTo('/auth/login')
  }

  return { user, status, isAdmin, authState, fetchUser, login, register, logout }
}
