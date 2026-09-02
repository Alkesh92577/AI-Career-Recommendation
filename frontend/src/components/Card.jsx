function Card({
    title,
    value,
    icon,
    description
}) {

    return (
        <div className="stat-card">

            <div className="stat-icon">
                {icon}
            </div>

            <div>
                <h3>{title}</h3>

                <h2>{value}</h2>

                {description && (
                    <p>{description}</p>
                )}
            </div>

        </div>
    );
}

export default Card;