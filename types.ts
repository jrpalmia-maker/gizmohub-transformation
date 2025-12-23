export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
}

export interface SectionProps {
    id: string;
    className?: string;
}

export enum ProjectPhase {
    Analysis = 'Requirement Gathering',
    Design = 'System Design',
    Dev = 'Development',
    Deployment = 'Testing & Deployment'
}