// Body type registry — single source of truth.
// Filenames must match the .glb files in assets/basemeshes/
// and the .png files in assets/basemeshes/silhouettes/

// @ts-ignore
import male            from '../assets/basemeshes/male.glb';
// @ts-ignore
import female          from '../assets/basemeshes/female.glb';
// @ts-ignore
import muscular_male   from '../assets/basemeshes/muscular_male.glb';
// @ts-ignore
import muscular_female from '../assets/basemeshes/muscular_female.glb';
// @ts-ignore
import thin_male       from '../assets/basemeshes/thin_male.glb';
// @ts-ignore
import thin_female     from '../assets/basemeshes/thin_female.glb';
// @ts-ignore
import fat_male        from '../assets/basemeshes/fat_male.glb';
// @ts-ignore
import fat_female      from '../assets/basemeshes/fat_female.glb';
// @ts-ignore
import old_male        from '../assets/basemeshes/old_male.glb';
// @ts-ignore
import old_female      from '../assets/basemeshes/old_female.glb';
// @ts-ignore
import boy             from '../assets/basemeshes/boy.glb';
// @ts-ignore
import girl            from '../assets/basemeshes/girl.glb';

export interface BodyType {
  id: string;
  label: string;
  mesh: any;
  sil: any;
}

export const BODY_TYPES: BodyType[] = [
  { id: 'male',             label: 'Male',             mesh: male,             sil: require('../assets/basemeshes/silhouettes/male.png') },
  { id: 'female',           label: 'Female',           mesh: female,           sil: require('../assets/basemeshes/silhouettes/female.png') },
  { id: 'muscular_male',    label: 'Muscular Male',    mesh: muscular_male,    sil: require('../assets/basemeshes/silhouettes/muscular_male.png') },
  { id: 'muscular_female',  label: 'Muscular Female',  mesh: muscular_female,  sil: require('../assets/basemeshes/silhouettes/muscular_female.png') },
  { id: 'thin_male',        label: 'Thin Male',        mesh: thin_male,        sil: require('../assets/basemeshes/silhouettes/thin_male.png') },
  { id: 'thin_female',      label: 'Thin Female',      mesh: thin_female,      sil: require('../assets/basemeshes/silhouettes/thin_female.png') },
  { id: 'fat_male',         label: 'Fat Male',         mesh: fat_male,         sil: require('../assets/basemeshes/silhouettes/fat_male.png') },
  { id: 'fat_female',       label: 'Fat Female',       mesh: fat_female,       sil: require('../assets/basemeshes/silhouettes/fat_female.png') },
  { id: 'old_male',         label: 'Old Male',         mesh: old_male,         sil: require('../assets/basemeshes/silhouettes/old_male.png') },
  { id: 'old_female',       label: 'Old Female',       mesh: old_female,       sil: require('../assets/basemeshes/silhouettes/old_female.png') },
  { id: 'boy',              label: 'Boy',              mesh: boy,              sil: require('../assets/basemeshes/silhouettes/boy.png') },
  { id: 'girl',             label: 'Girl',             mesh: girl,             sil: require('../assets/basemeshes/silhouettes/girl.png') },
];

export const getBodyType = (id: string | null): BodyType | undefined =>
  id ? BODY_TYPES.find((b) => b.id === id) : undefined;
