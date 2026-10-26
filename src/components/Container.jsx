// Ширина контента из макета: 1320px + 24px по бокам — совпадает с хедером и футером
function Container({ as: Tag = 'div', className = '', children, ...rest }) {
    return (
        <Tag className={`mx-auto w-full max-w-[1320px] px-6 ${className}`} {...rest}>
            {children}
        </Tag>
    );
}

export default Container;
