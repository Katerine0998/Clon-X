import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

// Sticky title bar shown at the top of every page (like X)
export const PageHeader = ({ title, subtitle, showBack = false }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="x-page-header">
      {showBack && (
        <button type="button" className="x-icon-btn" onClick={() => navigate(-1)} aria-label="Volver">
          <i className="bi bi-arrow-left"></i>
        </button>
      )}
      <div>
        <h1 className="x-page-title">{title}</h1>
        {subtitle && <small className="text-secondary">{subtitle}</small>}
      </div>
    </div>
  );
};  