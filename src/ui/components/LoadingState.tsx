interface LoadingStateProps {
  loading: boolean;
  error: string | null;
}

// Shows a spinner while loading or an error message; renders nothing when the data is ready.
export const LoadingState = ({ loading, error }: LoadingStateProps) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  return null;
};
