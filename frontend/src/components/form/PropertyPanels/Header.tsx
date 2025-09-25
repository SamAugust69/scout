import { Button } from "@/components/ui/button"
import {
    Dropdown,
    DropdownButton,
    DropdownChevron,
    DropdownContent,
    DropdownRadioButton,
    DropdownRadioGroup,
} from "@/components/ui/dropdown"
import { Input, InputInterface } from "@/components/ui/input"
import { Paragraph } from "@/components/ui/paragraph"
import { InputHTMLAttributes } from "react"

const PropertyDropdown = ({
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

const NumberInput = ({
    onChange,
    ...props
}: {
    label: string
    unit: string
} & InputHTMLAttributes<HTMLInputElement> &
    InputInterface) => {
    return <Input {...props} />
}

export const HeaderPropertyPanel = ({
    component,
    onChange,
}: {
    component: any
    onChange: (property: string, value: any) => void
}) => {
    const style = component.props.style || {}

    const updateStyle = (property: string, value: any) => {
        onChange("style", {
            ...style,
            [property]: value,
        })
    }

    return (
        <div className="space-y-6">
            {/* Content */}
            <div>
                <Paragraph>Content</Paragraph>
                <div>
                    <label className="mb-1 block text-xs font-medium text-neutral-300">
                        Heading Text
                    </label>
                    <Input
                        value={component.props.children || ""}
                        onChange={(e) => onChange("children", e.target.value)}
                        placeholder="Enter heading"
                    />
                </div>
            </div>

            {/* Size Preset */}
            <div>
                <Paragraph>Size</Paragraph>
                <PropertyDropdown
                    label="Preset size"
                    value={component.props.size || "default"}
                    options={[
                        { label: "Small", value: "sm" },
                        { label: "Default", value: "default" },
                        { label: "Large", value: "lg" },
                        { label: "Extra Large", value: "xl" },
                    ]}
                    onChange={(value) => onChange("size", value)}
                />
            </div>

            {/* Typography */}
            <div>
                <Paragraph>Typography</Paragraph>
                <div className="space-y-3">
                    <NumberInput
                        label="Font size override"
                        value={style.fontSize || ""}
                        unit="px"
                        onChange={(value) => updateStyle("fontSize", value)}
                        min={12}
                        max={96}
                    />
                    <div>
                        <label className="mb-2 block text-xs font-medium text-neutral-300">
                            Alignment
                        </label>
                        {/* <AlignmentButtonGroup
                            value={style.textAlign || "left"}
                            onChange={(value) =>
                                updateStyle("textAlign", value)
                            }
                        /> */}
                    </div>
                </div>
            </div>

            {/* Fill */}
            {/* <div>
                <Paragraph>Fill</Paragraph>
                <ColorInput
                    label="Text color"
                    value={style.color || "#000000"}
                    onChange={(value) => updateStyle("color", value)}
                />
            </div> */}
        </div>
    )
}
