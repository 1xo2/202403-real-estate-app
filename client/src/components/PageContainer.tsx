
type Props = {
    h1?: string;
    children: React.ReactNode;
    isWide?: boolean;
}

export default function PageContainer({ h1, children, isWide = false }: Props) {
    return (
        <div className={`p-3 mx-auto ${isWide ? "max-w-4xl" : "max-w-lg"}`}>
           {h1 && <h1 className="text-center text-3xl my-10">{h1}</h1>}
            {children}
        </div>

    )
}