'use client'

import React from 'react'
import BlogForm from '../components/BlogForm'
import PermissionGate from '@/components/dashboard/PermissionGate'

export default function CreateBlogPage() {
  return (
    <PermissionGate>
      <BlogForm />
    </PermissionGate>
  )
}
