import { Button } from "@/components/ui/button"
import {
    Dropdown,
    DropdownButton,
    DropdownChevron,
    DropdownContent,
    DropdownRadioButton,
    DropdownRadioGroup,
} from "@/components/ui/dropdown"
import { Input } from "@/components/ui/input"
import { Paragraph } from "@/components/ui/paragraph"
import { HTMLAttributes } from "react"

export const PropertyDropdown = ({
    label,
    options,
    onChange,
    value,
}: {
    onChange: (value: string) => void
    label: string
    value: string
    options: { label: string; value: string }[]
}) => {
    return (
        <Dropdown>
            <DropdownButton>
                <Button className="flex w-full items-center justify-between text-left text-sm font-bold dark:bg-neutral-900 dark:text-neutral-300">
                    {label} <DropdownChevron />
                </Button>
            </DropdownButton>
            <DropdownContent>
                {options && (
                    <DropdownRadioGroup setValue={onChange} value={value}>
                        {options.map(({ label, value }) => {
                            return (
                                <DropdownRadioButton value={value} key={label}>
                                    {label}
                                </DropdownRadioButton>
                            )
                        })}
                    </DropdownRadioGroup>
                )}
            </DropdownContent>
        </Dropdown>
    )
}

export const PropertyItem = ({
    label,
    children,
}: {
    label?: string
    children?: React.ReactNode
}) => {
    return (
        <div>
            {label && (
                <label className="mb-0.5 block text-xs font-semibold">
                    {label}
                </label>
            )}
            {children}
        </div>
    )
}

interface PropPanelInterface {
    groupLabel?: string
}

export const PropPanelGroup = ({
    groupLabel,
    children,
}: PropPanelInterface & HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className="space-y-1.5 border-b px-4 py-2 dark:border-neutral-700">
            <Paragraph className="text-sm font-bold">{groupLabel}</Paragraph>
            {children}
        </div>
    )
}

export const PropertyPanel = ({ children }: HTMLAttributes<HTMLDivElement>) => {
    return <div className="flex flex-col gap-2">{children}</div>
}

export const PropTest = () => {
    return (
        <PropertyPanel>
            <PropPanelGroup groupLabel="Content">
                <PropertyItem label="Size">
                    <Input />
                </PropertyItem>
                <PropertyItem>hello</PropertyItem>
            </PropPanelGroup>
            <PropPanelGroup groupLabel="Size">
                <PropertyItem label="Size">
                    <Input />
                </PropertyItem>
            </PropPanelGroup>
        </PropertyPanel>
    )
}
