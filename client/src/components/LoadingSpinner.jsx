import { Rings } from 'react-loader-spinner'

export default function LoadingSpinner({ size = 80 }) {
  return (
    <div className="flex justify-center items-center p-8">
      <Rings color="#3b82f6" height={size} width={size} />
    </div>
  )
}