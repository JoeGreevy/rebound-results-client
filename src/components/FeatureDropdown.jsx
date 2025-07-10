import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import {featureLookup} from '../assets/featureLookup';
import SubMenu from './SubMenu.jsx';

import {featureNames, shortToLong} from '../assets/featureNames';

function FeatureDropdown({ tree, feature, setter}){


    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className="px-4 py-2 bg-gray-100 rounded">
                { feature.name }
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content className='DMC'>
                    { tree.map((obj, idx) => {
                        // console.log("Rendering Dropdown element " + idx)
                        // console.log(tree.length)
                        return ( 
                            <SubMenu key={idx} obj={ obj } parents={[]} setter={setter}  />
                        )
                    })}
                </DropdownMenu.Content>
                
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}



export default FeatureDropdown;