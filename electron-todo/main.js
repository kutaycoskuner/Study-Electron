const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow, addWindow;
let todoList = [];

app.on('ready', () =>
{
    // ==== Instantiation
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    // ==== Create main window
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "assets/view-html/main.html"),
            protocol: "file:",
            slashes: true
        })
    );

    console.log('I am ready!');
    // ==== Create menu
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    // >> Input test
    ipcMain.on("key:inputValue", (err, data) =>
    {
        console.log(data);
    });

    // >> New Window
    ipcMain.on("key:newFrame", (err) =>
    {
        createFrame();
    });

    // >> Yeni pencere kapat
    ipcMain.on("newTodo:btnCreate", (err, data) =>
    {
        if (data)
        {
            todoList.push({
                id: todoList.length + 1,
                content: data
            });
        }
        console.log(todoList);
        addWindow.close();
        addWindow = null;
    });

    ipcMain.on("newTodo:btnClose", () =>
    {
        addWindow.close();
        addWindow = null;
    });

    mainWindow.on("close", () =>
    {
        app.quit();
    });
});

// >> Menu template icerigi
const mainMenuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "Add",
                click()
                {
                    createFrame();
                }
            },
            {
                label: "Delete"
            },
            {
                label: "Quit",
                accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",        // key 
                role: "quit"
            }
        ]
    },
    {
        label: "Reload",
        role: "reload"
    }
]

// >> Eger platform mac ise 
if (process.platform == "darwin")
{

}

if (process.env.NODE_ENV !== "production")
{
    mainMenuTemplate.push({
        label: "DevTools",
        click(item, focusedWindow)
        {
            focusedWindow.toggleDevTools();
        }
    })
}

function createFrame()
{
    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 560,
        height: 250
    });

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, "assets/view-html/newTodo.html"),
        protocol: "file:",
        slashes: true
    }));

    addWindow.on("close", () =>
    {
        addWindow = null;
    })
}


// ==== Query Functions
function getTodoList()
{
    return todoList;
}