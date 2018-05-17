//the main form
const entryForm = document.getElementById("entryForm");

//adding event listener on the form
entryForm.addEventListener("submit", onSubmit)

//constructor for user entry objects
function Entry(name, version, android_version, domain, link)
{
    this.name = name;
    this.version = version;
    this.android_version = android_version;
    this.domain = domain;
    this.link = link;
}

//array for storing entries
const entries = [];

//event listener for submit event on the form
function onSubmit(ev)
{
    ev.preventDefault();
    const userList = document.querySelector("#userList");
    if(entryForm.name.value == "")
    {
        const spanText = document.querySelector("#noNameErrorText");
        spanText.style.display = 'inline';
        return;
    }

    else
    {
        const spanText = document.querySelector("#noNameErrorText");
        spanText.style.display = "none";
    }

    const entry = new Entry(entryForm.name.value, entryForm.version.value, entryForm.android_version.value, entryForm.domain.value, entryForm.link.value);
    entries.push(entry);
    const deleteButton = document.createElement("BUTTON");
    deleteButton.innerHTML = "del";
    deleteButton.style.display = "none";
    deleteButton.style.float = "right";

    //we don't account for button to grow bigger than the size of its list item container, as that will only happen on a mouseover event
    
    

    //creating a list item
    const listItem = document.createElement("LI");
    listItem.appendChild(createDetail(entry));
    listItem.appendChild(deleteButton);

    listItem.addEventListener("mouseover", function()
        {
            deleteButton.style.display = "inline";
        }
    )

    listItem.addEventListener("mouseleave", function()
        {
            deleteButton.style.display = "none";
        }
    )
    userList.appendChild(listItem);

}


function createDetail(entry)
{
    const textSpan = document.createElement("SPAN");
    textSpan.innerHTML = "<b>" + entry.name + ": " + "</b>";

    if(entry.version != "")
        textSpan.innerHTML += "ver " + entry.version + ", ";
    if(entry.value == "")
        textSpan.innerHTML += "android ver " + entry.android_version + ", ";
    
    if(entry.value != "")
        textSpan.innerHTML += "domain " + entry.domain + ", ";
    
    if(entry.value != "")
    {
        //create an a tag
        const link = document.createElement("A");
        link.href = entry.link;
        link.innerText = "link";
        
        //adding anchor to span
        textSpan.appendChild(link);
    }

    return textSpan;
}