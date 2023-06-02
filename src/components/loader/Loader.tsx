import './loader.css';

interface LoaderProps {
    val: number;
}
const Loader = (props: LoaderProps) => {
    const { val } = props;

    return (
        <div className="loader">
            <div className="loader-container">
                <div
                    className="loader-indicator"
                    style={{
                        width: `${val}%`,
                    }}
                ></div>
            </div>
            {val}%
        </div>
    )
}

export default Loader