import { Input, InputInterface, InputProps } from "@/components/ui/input"
import { Paragraph } from "@/components/ui/paragraph"
import {
    PropertyDropdown,
    PropertyItem,
    PropertyPanel,
    PropPanelGroup,
} from "./PropertyPanel"

const NumberInput = ({
    onChange,
    ...props
}: {
    label: string
    unit: string
} & InputProps &
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
        <PropertyPanel>
            {/* Content */}
            <PropPanelGroup groupLabel="Content">
                <PropertyItem label="Heading Text">
                    <Input
                        size="sm"
                        value={component.props.children || ""}
                        onChange={(e) => {
                            onChange("children", e.currentTarget.value)
                        }}
                        placeholder="Enter Text"
                    />
                </PropertyItem>
                <PropertyItem>hello</PropertyItem>
            </PropPanelGroup>
            <PropPanelGroup groupLabel="Size">
                <PropertyItem label="Size Preset">
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
                </PropertyItem>
            </PropPanelGroup>
            <PropPanelGroup groupLabel="Typography">
                <PropertyItem label="Size Preset">
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
                </PropertyItem>
            </PropPanelGroup>
        </PropertyPanel>

        // <div className="">

        //     {/* Typography */}
        //     <div>
        //         <Paragraph>Typography</Paragraph>
        //         <div className="space-y-3">
        //             <NumberInput
        //                 label="Font size override"
        //                 value={style.fontSize || ""}
        //                 unit="px"
        //                 onChange={(value) => updateStyle("fontSize", value)}
        //                 min={12}
        //                 max={96}
        //             />
        //             <div>
        //                 <label className="mb-2 block text-xs font-medium text-neutral-300">
        //                     Alignment
        //                 </label>
        //                 {/* <AlignmentButtonGroup
        //                     value={style.textAlign || "left"}
        //                     onChange={(value) =>
        //                         updateStyle("textAlign", value)
        //                     }
        //                 /> */}
        //             </div>
        //         </div>
        //     </div>

        //     {/* Fill */}
        //     {/* <div>
        //         <Paragraph>Fill</Paragraph>
        //         <ColorInput
        //             label="Text color"
        //             value={style.color || "#000000"}
        //             onChange={(value) => updateStyle("color", value)}
        //         />
        //     </div> */}
        // </div>
    )
}
