export function Button({
                         submitting = false,
                         disabled = false,
                         value = 'Submit',
                         clickHandler = undefined,
                         extraClass = '',
                         buttonType = 'button',
                       }) {
  const isErrorClass = disabled ? 'opacity-50 cursor-not-allowed ' : 'hover:text-white hover:bg-gray-700 ';

  return (
    <button
      type={buttonType}
      disabled={submitting || disabled}
      onClick={clickHandler}
      className={extraClass + isErrorClass + `px-4 py-2.5 text-sm border bg-gray-800 text-gray-400 border-gray-600 tracking-wide`}
    >
      {submitting ? 'Saving...' : value}
    </button>
  )
}
