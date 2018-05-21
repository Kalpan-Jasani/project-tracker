const project =
{
    init: function()
    {
        //the element to be cloned for each list item
        this.listItemTemplate = document.querySelector('#listItemTemplate');

        //the main form
        this.entryForm = document.getElementById("entryForm");

        //the id for each list item
        this.idGenerator = 0;
        
        //array for storing entries
        this.entries = [];

        //the html list element for main entry list
        this.entryListHTML = document.querySelector("#entryList");

        //adding event listener on the form
        entryForm.addEventListener("submit", (ev) => 
        {
            ev.preventDefault();
            this.onSubmit(ev);
        });
    },

    //event listener for submit event on the form
    onSubmit: function(ev)
    {
        //prevent the submit event from performing its default
        ev.preventDefault();

        //make a new entry for the array
        const entry = new Entry(entryForm.name.value, entryForm.version.value, entryForm.android_version.value, entryForm.domain.value, entryForm.link.value, ++this.idGenerator);
        
        //insert the entry to the begining of the array
        this.entries.unshift(entry);
        
        //clone a entry listhtml item from a template
        const listItem = this.listItemTemplate.cloneNode(true);
        
        listItem.classList.remove("template");
        listItem.dataset.id = this.idGenerator;

        const deleteButton = listItem.querySelector("#delButton");
        const favButton = listItem.querySelector("#favButton");
        const upButton = listItem.querySelector("#upButton");
        const downButton = listItem.querySelector("#downButton");

        upButton.disabled = true;

        // if it is the only one, then it is also the last item in the html list. We then set the down button to disabled. This will ofcourse happen the first time
        //important: if we do this, which happens the first time, the initial "state" of the html list if made. Then we don't have to check for last items down button on new additions
        if(this.entries.length === 1)
        {
            downButton.disabled = true;
        }
        else
        {
            this.entryListHTML.firstChild.querySelector("#upButton").disabled = false;
        }
        //allowing hover listening for each list row (for outlook like controls!)
        listItem.addEventListener("mouseover", () => 
            {
                listItem.querySelector("#controlsForListItem").style.visibility = "visible";
                
            }
        );

        listItem.addEventListener("mouseleave", () => 
            {
                listItem.querySelector("#controlsForListItem").style.visibility = "hidden";        
                if(entry.fav)
                    listItem.querySelector("#favStar").style.visibility = "visible";
            }
            
        );

        //setting the payload data for the row
        const spanNode = this.createDetail(entry);

        //the actual element in the DOM
        const detailSpan = listItem.querySelector("#detail");

        //rechanging the content to be a copy of the created span spanNode. Equivalent to deep cloning spanNode into detailSpan
        detailSpan.innerHTML = spanNode.innerHTML;

        //we don't account for button to grow bigger than the size of its list item container, as that will only happen on a mouseover event
        //TODO: css handling for that

        //prepend the item in the list

        //if this is the first one
        if(this.entries.length == 1)
        {
            this.entryListHTML.appendChild(listItem);
        }
        else
            this.entryListHTML.insertBefore(listItem, this.entryListHTML.firstChild);
    
        deleteButton.addEventListener('click', (ev) => 
            {
                listItem.style.maxHeight = "0";
                setTimeout(() => {
                    listItem.remove();
                }, 250);

                this.onDelete(entry.id);
            }
        );
        favButton.addEventListener('click', (ev) =>
            {
                const starImgHTML = listItem.querySelector("#favStar");
                const starImgOutlineHTML = listItem.querySelector("#favStarOutline");
                if(entry.fav == false)
                {
                    starImgOutlineHTML.style.display = "none";
                    starImgHTML.style.display = "inline-block";
                }
                    
                else
                {
                    starImgHTML.style.display = "none";
                    starImgOutlineHTML.style.display = "inline-block";
                }
                this.onFavouriteSelected(entry.id);
            }
        );

        upButton.addEventListener("click", (ev) =>
            {
                this.swap(listItem.previousSibling, listItem);
            }
        );

        downButton.addEventListener("click", (ev) =>
            {
                this.swap(listItem, listItem.nextSibling);
            }
        );
        this.entryForm.reset();
        this.entryForm.name.focus();
    },

    onDelete: function(id)
    {
        //get the entry with the id
        const entry = this.entries.find((entry) => 
            {
                if(entry.id == id)
                    return true;
                else
                    return false;
            }
        );
        let index = this.entries.indexOf(entry);

        //remove the element from the array
        this.entries.splice(index, 1);
    },

    onFavouriteSelected: function(id)
    {
        const entry = this.entries.find((entry) =>
            {
                if(entry.id == id)
                    return true;
                else
                    return false;
            }
        );

        entry.fav = entry.fav? false: true;

        //TODO: handle selection of favourite
    },

    createDetail: function(entry)
    {
        const textSpan = document.createElement("SPAN");
        textSpan.innerHTML = "<b>" + entry.name + ": " + "</b>";

        if(entry.version != "")
            textSpan.innerHTML += ", ver " + entry.version;
        if(entry.android_version != "")
            textSpan.innerHTML += ", Android ver " + entry.android_version;

        if(entry.domain != "")
            textSpan.innerHTML += ", Domain " + entry.domain;

        if(entry.link != "")
        {
            //create an a tag
            const link = document.createElement("A");
            link.href = entry.link;
            link.innerText = "Project link";

            //adding a comma before thr hyperlink
            textSpan.innerHTML += ", ";

            //adding anchor, or link, to span
            textSpan.appendChild(link);
        }

        return textSpan;
    },
    swap: function(item1, item2)
    {

        //getting the indexes of entries using the id's
        const id1 = item1.dataset.id;
        const id2 = item2.dataset.id;

        const entry1 = this.getEntryByID(id1);
        const entry2 = this.getEntryByID(id2);

        const index1 = this.entries.indexOf(entry1);
        const index2 = this.entries.indexOf(entry2);

        //if item1 is the first list item in the list
        if(this.entryListHTML.firstChild === item1)
        {
            upButton1 = item1.querySelector("#upButton");
            upButton1.disabled = false;
            
            upButton2 = item2.querySelector("#upButton");
            upButton2.disabled = true;
        }

        if(this.entryListHTML.lastElementChild === item2)
        {
            downButton1 = item1.querySelector("#downButton");
            downButton2 = item2.querySelector("#downButton");

            downButton1.disabled = true;
            downButton2.disabled = false;
        }

        this.entryListHTML.insertBefore(item2, item1);
        const temp = this.entries[index1];
        this.entries[index1] = this.entries[index2];
        this.entries[index2] = temp;
    },

    //TODO: use this function everywhere (in delete and fav, etc)
    getEntryByID: function(id)
    {
        const entry = this.entries.find((entry) => 
            {
                if(entry.id == id)
                    return true;
            }
        );

        return entry;
    },
};

//initialize the class to start listening after set up
project.init();



//constructor for user entry objects
function Entry(name, version, android_version, domain, link, id)
{
    this.name = name;
    this.version = version;
    this.android_version = android_version;
    this.domain = domain;
    this.link = link;
    this.id = id;
    this.fav = false;
}