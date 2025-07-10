const sanitizeUser = ({
  _id,
  fullname,
  username,
  email,
  role,
  createdAt,
  updatedAt,
  avatarUrl,
  isEmailVerified,
  bio,
}) => {
  if (!_id) return null;

  return {
    _id,
    fullname,
    username,
    email,
    role,
    createdAt,
    updatedAt,
    avatarUrl,
    isEmailVerified,
    bio,
  };
};

export { sanitizeUser };
