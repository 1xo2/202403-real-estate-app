
type Props = {
    h1: string;
    children: React.ReactNode;
}

export default function PageContainer({ h1, children }: Props) {
    return (
        <div className="mx-auto p-3 max-w-lg">
            <h1 className="text-center text-3xl my-10">{h1}</h1>
            {children}
        </div>

    )
}