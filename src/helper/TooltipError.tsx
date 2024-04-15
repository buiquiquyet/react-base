import './styles/tooltip.scss';
import SVG from 'react-inlinesvg';

interface Props {
  Errors: { regex: RegExp; message: string }[];
  value: string;
  error: string;
}

function TooltipError({ Errors, value }: Props) {
  return (
    <div className={`position-absolute tooltip-error-wapper`}>
      {Errors.map((item, index) => (
        <div key={index} className="tooltip-error">
          <div className="tooltip-error__icon">
            <SVG
              key={value}
              src={
                import.meta.env.VITE_PUBLIC_URL +
                (!item.regex.test(value.trim())
                  ? 'images/error.svg'
                  : 'images/pass.svg')
              }
            />
          </div>
          <div className="tooltip-error__content">
            <p className="tooltip-error__content__text">{item.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TooltipError;
