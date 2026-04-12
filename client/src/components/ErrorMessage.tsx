

interface ErrorMessageProps{
    text: string | undefined
}

const ErrorMessage = ({text}: ErrorMessageProps) => {
  return (
    <div>
        <p className="text-red-500 text-xs">
        {text}
        </p>
    </div>
  )
}

export default ErrorMessage
