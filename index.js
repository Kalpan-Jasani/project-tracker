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
        ev.preventDefault();
        const entry = new Entry(entryForm.name.value, entryForm.version.value, entryForm.android_version.value, entryForm.domain.value, entryForm.link.value, ++this.idGenerator);
        
        this.entries.unshift(entry);
        
        const listItem = this.listItemTemplate.cloneNode(true);
        
        listItem.classList.remove("template");
        listItem.dataset.id = this.idGenerator;

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
    
        //set listeners for delete button and fav button
        const deleteButton = listItem.querySelector("#delButton");
        const favButton = listItem.querySelector("#favButton");

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
    }
}

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