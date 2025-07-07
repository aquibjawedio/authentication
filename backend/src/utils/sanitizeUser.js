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
  };
};

export { sanitizeUser };
