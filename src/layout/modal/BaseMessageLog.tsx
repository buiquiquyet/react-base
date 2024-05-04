import './styles/BaseMessageLog.scss'
interface MessageProps {
    text?: string
    type?: string
}
const BaseMessageLog: React.FC<MessageProps> = ({text}) => {

    return ( 
        <div className="mess-invalid mt-1">{text}</div>
     );
}

export default BaseMessageLog;