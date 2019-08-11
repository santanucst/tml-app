import { trigger, transition, style, animate } from '@angular/core';

export const APP_DASHBOARD_ANIMATIONS = [

    trigger('DashboardTilesFlyInOutDelay0', [
        transition('void => *', [
            style({ opacity: 0 }),
            style({ transform: 'translateY(10px)' }),
            animate("500ms 100ms ease-in")
        ]),
        transition('* => void', [
            style({ transform: 'translateY(0px)', opacity: 1 }),
            animate("500ms ease-in", style({ transform: 'translateY(10px)', opacity: 0 }))
        ])
    ]),
    trigger('DashboardTilesFlyInOutDelay1', [
        transition('void => *', [
            style({ opacity: 0 }),
            style({ transform: 'translateY(10px)' }),
            animate("500ms 300ms ease-in")
        ]),
        transition('* => void', [
            style({ transform: 'translateY(0px)', opacity: 1 }),
            animate("500ms ease-in", style({ transform: 'translateY(10px)', opacity: 0 }))
        ])
    ]),
    trigger('DashboardTilesFlyInOutDelay2', [
        transition('void => *', [
            style({ opacity: 0 }),
            style({ transform: 'translateY(10px)' }),
            animate("500ms 500ms ease-in")
        ]),
        transition('* => void', [
            style({ transform: 'translateY(0px)', opacity: 1 }),
            animate("500ms ease-in", style({ transform: 'translateY(10px)', opacity: 0 }))
        ])
    ])

]

export const APP_TOP_MESSAGE_BOX_ANIMATIONS = [trigger('MessageBarAnimation', [
    transition('void => *', [
        style({ transform: 'translateY(-10px)', opacity: 0 }),
        animate('500ms 200ms ease-in', style({ transform: 'translateY(0px)', opacity: 1 }))
    ]),
    transition('* => void', [
        style({ transform: 'translateY(0px)', opacity: 1 }),
        animate("500ms ease-in", style({ transform: 'translateY(-10px)', opacity: 0 }))
    ])
])]