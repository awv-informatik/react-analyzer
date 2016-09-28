import { url as getUrl} from 'awv3/core/helpers';

export default {
    status: {
        url: getUrl("url") || (document.location.hostname == 'localhost' ? 'http://localhost:8181' : `${window.location.protocol}//${document.location.hostname}`),
        connected: false,
        message: ""
    },
    settings: {
        template: require("raw!../assets/template.txt"),
        filter: "",
        editorText: localStorage.getItem("EDITOR_TEXT")
    },
    internal: {
        stats: {
            peak: 1,
            sessions: 0,
            busy: 0,
            users: 0,
            analyzers: 0,
            queue: 0,
            graph: new Array(50).fill(0),
            timestamp: Date.now()
        }
    }
};
