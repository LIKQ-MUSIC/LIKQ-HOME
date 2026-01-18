import { ApiEndpoint } from '@/components/common/ApiDocViewer/ApiDocViewer'

export const MEDIA_API_DOCS: ApiEndpoint[] = [
  {
    id: 'upload-media',
    method: 'POST',
    path: '/media',
    title: 'Upload Media',
    description: 'Upload a file to storage.',
    authentication: true,
    permissions: ['media.manage'],
    bodyParams: [
      {
        name: 'file',
        type: 'file',
        required: true,
        description: 'File object to upload'
      },
      {
        name: 'folder',
        type: 'string',
        required: false,
        description: 'Target folder path in storage (e.g., "products/images")'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'File uploaded successfully',
        example: {
          success: true,
          data: {
            url: 'https://storage.example.com/folder/filename.jpg',
            key: 'folder/filename.jpg',
            filename: 'filename.jpg',
            size: 1024,
            mimeType: 'image/jpeg'
          }
        }
      },
      {
        status: 400,
        description: 'Upload failed',
        example: { success: false, error: 'Upload failed' }
      }
    ]
  },
  {
    id: 'delete-media',
    method: 'DELETE',
    path: '/media/:id',
    title: 'Delete Media',
    description: 'Delete a file from storage.',
    authentication: true,
    permissions: ['media.manage'],
    pathParams: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'ID or Key of the media file to delete'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'File deleted successfully',
        example: { success: true }
      },
      {
        status: 404,
        description: 'File not found',
        example: { success: false, error: 'File not found' }
      }
    ]
  }
]
