import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import {featureLookup} from '../assets/featureLookup';
import SubMenu from './SubMenu.jsx';

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
                {/* 
                    <DropdownMenu.Sub key="performance">
                        <DropdownMenu.SubTrigger>
                            Performance
							<div className="RightSlot">
								-{'>'}
							</div>
                        </DropdownMenu.SubTrigger>
                        <DropdownMenu.Portal key="performance">
                            <DropdownMenu.SubContent className='DMSC'>
                                { tree["performance"]["leaves"].map((feat, fidx) => (
                                    <DropdownMenu.Item key={feat} onSelect={() => setter(featureLookup(["performance"], feat))}>
                                        <span>{ featureLookup(["performance"], feat).name }</span>
                                    </DropdownMenu.Item>    
                                ))} 
                            </DropdownMenu.SubContent>  
                        </DropdownMenu.Portal>
                    </DropdownMenu.Sub>
                    <DropdownMenu.Sub key="kinetics">
                        <DropdownMenu.SubTrigger>
                            Kinetics
							<div className="RightSlot">
								-{'>'}
							</div>
                        </DropdownMenu.SubTrigger>
                        <DropdownMenu.Portal key="performance">
                            <DropdownMenu.SubContent className='DMSC'>
                                { ["moments", "power"].map((met, midx) => (
                                    <DropdownMenu.Sub key={met}>
                                        <DropdownMenu.SubTrigger>
                                            {met.charAt(0).toUpperCase() + met.slice(1)}
                                            <div className="RightSlot">
                                                -{'>'}
                                            </div>
                                        </DropdownMenu.SubTrigger>
                                        <DropdownMenu.Portal key={met}>
                                            <DropdownMenu.SubContent className='DMSC'>
                                                { tree["kinetics"][met].leaves.map((feat, fidx) => (
                                                    <DropdownMenu.Item key={feat} onSelect={() => setter(featureLookup(["kinetics", "pow", "both", "ank"], feat))}>
                                                        <span>{ featureLookup(["kinetics", "pow", "both", "ank"], feat).name }</span>
                                                    </DropdownMenu.Item>
                                                ))}
                                            </DropdownMenu.SubContent>
                                        </DropdownMenu.Portal>

                                    </DropdownMenu.Sub>
                                ))}
                            </DropdownMenu.SubContent>  
                        </DropdownMenu.Portal>
                    </DropdownMenu.Sub>
                </DropdownMenu.Content> */}
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}



export default FeatureDropdown;