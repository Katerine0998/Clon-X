interface AvatarProps {
  name: string;
  size?: number;
}

// Circle with the first letter of the name (no profile pictures yet)
export const Avatar = ({ name, size = 40 }: AvatarProps) => (
  <div
    className="avatar rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
    style={{ width: size, height: size, fontSize: size * 0.42 }}
    aria-hidden="true"
  >
    {name.charAt(0).toUpperCase()}
  </div>
);