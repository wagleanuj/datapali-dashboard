import { ReactNode } from "react";
interface QuestionButtonProps {
    questionId: string;
    questionTitle: string;
    isExpanded: boolean;
    children: ReactNode;
    path: number[];
    readablePath: string;
    handleDeletion: (id: string, path_: number[]) => void;
    handleMoveUp: (id: string, path_: number[]) => void;
}
export declare const QuestionButton: (props: QuestionButtonProps) => JSX.Element;
export {};
