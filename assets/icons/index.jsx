import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Home from './Home'
import ArrowLeft from './ArrowLeft'
import Mail from './Mail'
import Lock from './Lock'
import User from './User'
import Heart from './Heart'
import Plus from './Plus'
import Logout from './logout'
import Edit from './Edit'
import Call from './Call'
import Camera from './Camera'
import Location from './Location'
import Image from './Image'
import Delete from './Delete'
import Comment from './Comment'
import Share from './Share'
import ThreeDotsHorizontal  from './ThreeDotsHorizontal'
import Send from './Send'
import Search from './Search'
import Star from './Star'
import { theme } from '../../constants/theme'

const icons = {
  home: Home,
  arrowLeft: ArrowLeft,
  mail: Mail,
  lock: Lock,
  user: User,
  heart: Heart,
  plus: Plus,
  logout: Logout,
  edit: Edit,
  call: Call,
  camera: Camera,
  location: Location,
  image: Image,
  delete: Delete,
  comment: Comment,
  share: Share,
  threeDotsHorizontal: ThreeDotsHorizontal,
  send: Send,
  search: Search,
  star: Star,
}

const Icon = ({name, ...props}) => {
    const IconComponent = icons[name];
  return (
    <IconComponent 
        heigth={props.size || 24} 
        width={props.width || 30} 
        strokeWidth={props.strokeWidth || 1.9}
        color={theme.colors.textLight}
        {...props}
    />
  )
}

export default Icon;