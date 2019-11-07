import { ReactNode } from "react";
interface SectionButtonProps {
    sectionId: string;
    onClick: (id: string, path: number[]) => void;
    path: number[];
    readablePath: string;
    handleDeletion: (id: string, path: number[]) => void;
    handleMoveUp: (id: string, path: number[]) => void;
    children: ReactNode;
    handleSectionNameChange: (v: string) => void;
    handleOpenConditionSettings: () => void;
    handleCustomIdChange: (v: string) => void;
    sectionName: string;
    customId: string;
}
export declare const SectionButton: (props: SectionButtonProps) => JSX.Element;
export {};
