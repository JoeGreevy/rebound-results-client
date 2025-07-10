import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import {featureLookup} from '../assets/featureLookup';
import {featureNames, shortToLong} from '../assets/featureNames';

function SubMenu({ obj, parents, setter}){
    
    const newParents = [...parents, obj.name]
    //console.log("Track Parents in Sub: " + parents.join(", "))
    if (obj.type === "sub"){
        return (
            <DropdownMenu.Sub key ={obj.name}>
                <DropdownMenu.SubTrigger>
                    {shortToLong[obj.name].charAt(0).toUpperCase() + shortToLong[obj.name].slice(1)}
                    <div className="RightSlot">
                        -{'>'}
                    </div>
                </DropdownMenu.SubTrigger>
                <DropdownMenu.Portal key={obj.name}>
                    <DropdownMenu.SubContent className='DMSC'>
                        { renderSub(obj, newParents, setter)}
                        {/* {(() => {
                            if (obj.children.length === 0) {
                                
                                <DropdownMenu.Item key="no-children" disabled>
                                    <span>No Features</span>
                                </DropdownMenu.Item>
                                
                            }
                            obj.children.map((item, idx) => {
                                return (
                                    <SubMenu obj={item} parents={newParents} setter={setter} />
                                )
                            })})} */}
                    </DropdownMenu.SubContent>  
                </DropdownMenu.Portal>
            </DropdownMenu.Sub>
        )
    } else if (obj.type === "item") {
        const feature = featureLookup(newParents)
        return (
            <DropdownMenu.Item key={obj.name} onSelect={() => {
                //console.log("Getting: " + feature.key)
                setter(feature)
            }}>
                <span>{ featureNames[obj.name] }</span>
            </DropdownMenu.Item> 
        )    
    } else if (obj.type === "subj" || obj.type === "date" || obj.type === "pro") {
        return (
            <DropdownMenu.Item className="subj-item" key={obj.name} onSelect={() => {
                //console.log("Getting: " + obj.key)
                setter(obj.key)
            }}>
                <span>{obj.name }</span>
            </DropdownMenu.Item> 
        )
    }
}

function renderSub(obj, parents, setter) {
    if (obj.children.length === 0) {
        return (                        
            <DropdownMenu.Item key="no-children" disabled>
                <span>No Features</span>
            </DropdownMenu.Item>
        )
    }
    return (
        obj.children.map((item, idx) => {
            return <SubMenu key={idx} obj={item} parents={parents} setter={setter} />
        })
    )   
}

export default SubMenu;