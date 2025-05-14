export function Card({ children, ...props }) {
  return <div {...props} className='rounded shadow bg-white'>{children}</div>;
}

export function CardContent({ children, ...props }) {
  return <div {...props}>{children}</div>;
}