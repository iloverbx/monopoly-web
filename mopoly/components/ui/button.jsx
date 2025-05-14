export function Button({ onClick, children, ...props }) {
  return <button onClick={onClick} {...props} className='px-3 py-2 bg-blue-600 text-white rounded'>{children}</button>;
}