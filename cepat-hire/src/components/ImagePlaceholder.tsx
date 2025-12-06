import { ReactNode, useState } from 'react'
import { Image, Upload, User, Building2 } from 'lucide-react'

type ShapeVariant = 'circle' | 'square' | 'rounded' | 'rectangle'
type SizeVariant = 'sm' | 'md' | 'lg' | 'xl'

interface ImagePlaceholderProps {
  shape?: ShapeVariant
  size?: SizeVariant
  icon?: ReactNode
  text?: string
  src?: string
  alt?: string
  onUpload?: (file: File) => void
  uploadable?: boolean
  className?: string
}

const getSizeStyles = (size: SizeVariant, shape: ShapeVariant) => {
  if (shape === 'rectangle') {
    const sizes = {
      sm: 'w-32 h-20',
      md: 'w-48 h-32',
      lg: 'w-64 h-40',
      xl: 'w-80 h-48',
    }
    return sizes[size]
  }

  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  }
  return sizes[size]
}

const getShapeStyles = (shape: ShapeVariant) => {
  const shapes = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-xl',
    rectangle: 'rounded-lg',
  }
  return shapes[shape]
}

const getIconSize = (size: SizeVariant) => {
  const sizes = {
    sm: 20,
    md: 32,
    lg: 40,
    xl: 56,
  }
  return sizes[size]
}

export const ImagePlaceholder = ({
  shape = 'rounded',
  size = 'md',
  icon,
  text,
  src,
  alt = 'Image placeholder',
  onUpload,
  uploadable = false,
  className = '',
}: ImagePlaceholderProps) => {
  const [imageError, setImageError] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const sizeStyles = getSizeStyles(size, shape)
  const shapeStyles = getShapeStyles(shape)
  const iconSize = getIconSize(size)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onUpload?.(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onUpload?.(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const displayImage = preview || src
  const showPlaceholder = !displayImage || imageError

  return (
    <div
      className={`
        ${sizeStyles}
        ${shapeStyles}
        relative
        overflow-hidden
        flex
        items-center
        justify-center
        transition-all
        duration-200
        ${uploadable ? 'cursor-pointer hover:scale-105' : ''}
        ${isDragging ? 'ring-4 ring-purple-400' : ''}
        ${className}
      `}
      style={{
        backgroundColor: showPlaceholder ? '#f8eee7' : 'transparent',
        border: showPlaceholder ? '2px dashed #94618e' : 'none',
      }}
      onDrop={uploadable ? handleDrop : undefined}
      onDragOver={uploadable ? handleDragOver : undefined}
      onDragLeave={uploadable ? handleDragLeave : undefined}
    >
      {showPlaceholder ? (
        <div className="flex flex-col items-center justify-center gap-2 p-4">
          {icon || (
            uploadable ? (
              <Upload size={iconSize} style={{ color: '#94618e', opacity: 0.6 }} />
            ) : (
              <Image size={iconSize} style={{ color: '#94618e', opacity: 0.6 }} />
            )
          )}
          {text && (
            <span
              className="text-xs font-medium text-center"
              style={{ color: '#94618e', opacity: 0.7 }}
            >
              {text}
            </span>
          )}
          {uploadable && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          )}
        </div>
      ) : (
        <>
          <img
            src={displayImage}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
          {uploadable && (
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
              <Upload
                size={iconSize / 2}
                className="opacity-0 hover:opacity-100 transition-opacity"
                style={{ color: '#f8eee7' }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Avatar Placeholder (specialized for user avatars)
interface AvatarPlaceholderProps {
  name?: string
  src?: string
  size?: SizeVariant
  type?: 'user' | 'company'
  uploadable?: boolean
  onUpload?: (file: File) => void
}

export const AvatarPlaceholder = ({
  name,
  src,
  size = 'md',
  type = 'user',
  uploadable = false,
  onUpload,
}: AvatarPlaceholderProps) => {
  const getInitials = (name?: string) => {
    if (!name) return '?'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const getFontSize = (size: SizeVariant) => {
    const sizes = {
      sm: 'text-xs',
      md: 'text-base',
      lg: 'text-xl',
      xl: 'text-3xl',
    }
    return sizes[size]
  }

  const initials = getInitials(name)
  const fontSize = getFontSize(size)

  if (src) {
    return (
      <ImagePlaceholder
        shape="circle"
        size={size}
        src={src}
        alt={name || 'Avatar'}
        uploadable={uploadable}
        onUpload={onUpload}
      />
    )
  }

  if (name) {
    return (
      <div
        className={`
          ${getSizeStyles(size, 'circle')}
          rounded-full
          flex
          items-center
          justify-center
          font-bold
          ${fontSize}
          relative
          transition-all
          duration-200
          ${uploadable ? 'cursor-pointer hover:scale-105' : ''}
        `}
        style={{
          backgroundColor: '#94618e',
          color: '#f8eee7',
        }}
      >
        {initials}
        {uploadable && onUpload && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onUpload(file)
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
          />
        )}
      </div>
    )
  }

  return (
    <ImagePlaceholder
      shape="circle"
      size={size}
      icon={type === 'user' ? <User size={getIconSize(size)} /> : <Building2 size={getIconSize(size)} />}
      uploadable={uploadable}
      onUpload={onUpload}
    />
  )
}
