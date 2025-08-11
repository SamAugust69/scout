export const Divider = ({ className }: { className?: string }) => {
    return (
        <div className="relative">
            <span
                className={`relative block h-0.5 w-full rounded-sm bg-[#7C8C77] ${className}`}
            ></span>
        </div>
    )
}
