import { Component, Inject, OnInit } from '@angular/core';
import { v4 as uuidv4, validate } from 'uuid';
import { InternalVersionSegmentation } from 'src/app/models/internal-version-segmentations/internal-version-segmentation.model';
import { BreakpointObserver, Breakpoints, BreakpointState, } from '@angular/cdk/layout';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { Category } from 'src/app/models/categories/category.model';
import { InternalVersionSegmentationCreateDto } from 'src/app/models/internal-version-segmentations/internal-version-segmentation-create.dto';
import { InternalVersion } from 'src/app/models/internal-versions/internal-version.model';
import { Segment } from 'src/app/models/segments/segment.model';
import { InternalVersionSegmentationService } from 'src/app/services/internal-version-segmentations/internal-version-segmentation.service';
import { NgxMatSelectionChangeEvent } from 'ngx-mat-select';
import { Clipboard } from '@angular/cdk/clipboard';
import { Bodywork } from 'src/app/models/bodyworks/bodywork.model';
import { BodyStyle } from 'src/app/models/body-styles/body-style.model';
import { Subsegment } from 'src/app/models/subsegments/subsegment.model';
import { Usage } from 'src/app/models/usages/usage.model';
import { Traction } from 'src/app/models/tractions/traction.model';
import { Power } from 'src/app/models/powers/power.model';
import { FuelTypes } from 'src/app/models/fuel/fuel.model';
import { CabinaSD } from 'src/app/models/cabinaSD/cabinaSD.model';
import { Wheelbases } from 'src/app/models/wheelbases/wheelbases.model';
import { AxleBase } from 'src/app/models/axlebase/axlebase.model';
import { Door } from 'src/app/models/door/door.model';
import { Gear } from 'src/app/models/gear/gear.model';
import { MCGTotalMkt } from 'src/app/models/mCGTotalMkt/mcgtotalmkt.model';
import { MotorDT } from 'src/app/models/motordt/motordt.model';
import { Rule } from 'src/app/models/rule/rule.model';
import { Source } from 'src/app/models/source/source.model';
import { PBT } from 'src/app/models/pbt/pbt.model';
import { PbtTN } from 'src/app/models/pbtTn/pbtTn.model';
import { AltBodySt } from 'src/app/models/altbodyst/altbodyst.model';
import { AltCateg } from 'src/app/models/altcateg/altcateg.model';
import { AltSegm } from 'src/app/models/altsegm/altsegm.model';
import { AmgCompSet } from 'src/app/models/amgcompset/amgcompset.model';
import { Apertura3 } from 'src/app/models/apertures-three/aperture-three.model';
import { Apertura4 } from 'src/app/models/apertures-four/aperture-four.model';
import { CabinaCF } from 'src/app/models/cabinaCF/cabinaCF.model';
import { EngineCapacity } from 'src/app/models/enginecapacity/enginecapacity.model';
import { CjdCompetitive } from 'src/app/models/cjdcompetitive/cjdcompetitive.model';
import { CompetitiveCjd } from 'src/app/models/competitivecdj/competitivecdj.model';
import { Group } from 'src/app/models/group/group.model';
import { Ni } from 'src/app/models/nI/nI.model';
import { RelevMB } from 'src/app/models/relevMB/relevMb';
import { Ssegm } from 'src/app/models/ssegm/ssegm';
import { SegmentationAux1 } from 'src/app/models/segmentationAux1/segmetationaux1';
import { mercedesConfiguration } from 'src/app/models/mercedesConfiguration/mercedesconfiguration.model';
import { CatInternalVersion } from 'src/app/models/cat-internal-versions/cat-internal-versions.model';
import { ApertureOne } from 'src/app/models/apertures-one/aperture-one.model';
import { ApertureTwo } from 'src/app/models/apertures-two/aperture-two.model';

export interface DialogData {
  internalVersionSegmentation: InternalVersionSegmentation;
  internalVersionSegmentationId: string;
  internalVersions: InternalVersion[];
  categories: Category[];
  segments: Segment[];
  bodyworks: Bodywork[];
  bodyStyles: BodyStyle[];
  subsegments: Subsegment[];
  usages: Usage[];
  tractions: Traction[];
  fueltypes: FuelTypes[];
  cabinSDs: CabinaSD[];
  wheelbases: Wheelbases[];
  axlebases: AxleBase[];
  doors: Door[];
  gears: Gear[];
  mcgTotalMkts: MCGTotalMkt[];
  motorDTs: MotorDT[];
  catRules: Rule[];
  pbts: PBT[];
  pbttns: PbtTN[];
  sources: Source[];
  powers: Power[];
  altBodysts: AltBodySt[];
  altCategs: AltCateg[];
  altSegms: AltSegm[];
  amgCompSets: AmgCompSet[];
  aperturesOne: ApertureOne[];
  aperturesTwo: ApertureTwo[];
  aperturesThree: Apertura3[];
  aperturesFour: Apertura4[];
  cabinCFs: CabinaCF[];
  engineCapacitys: EngineCapacity[];
  cjdCompetitives: CjdCompetitive[];
  competitiveCJDs: CompetitiveCjd[];
  relevMBs: RelevMB[];
  ssegms: Ssegm[];
  segmentationAux1s: SegmentationAux1[];
  groups: Group[];
  nis: Ni[];
  mercedesConfiguration: mercedesConfiguration[];
}
@Component({
  selector: 'app-internal-version-segmentation-dialog',
  templateUrl: './internal-version-segmentation-dialog.component.html',
  styleUrls: ['./internal-version-segmentation-dialog.component.scss'],
})
export class InternalVersionSegmentationDialogComponent implements OnInit {
  TAG = 'InternalVersionSegmentationDialogComponent';
  isXsOrSm = false;
  formGroup: FormGroup;
  ActionMode = ActionMode;
  actionMode = ActionMode.create;
  loading = false;
  accept = 'Guardar';
  private unsubscribeAll: Subject<any> = new Subject();
  internalVersionSegmentation: InternalVersionSegmentation = new InternalVersionSegmentation();
  internalVersions: CatInternalVersion[] = [];
  categories: Category[] = [];
  category: Category = new Category();
  categoryId: string = '';
  segments: Segment[] = [];
  filteredSegments: Segment[] = [];
  bodyworks: Bodywork[] = [];
  bodyStyles: BodyStyle[] = [];
  subsegments: Subsegment[] = [];
  usages: Usage[] = [];
  tractions: Traction[] = [];
  fueltypes: FuelTypes[] = [];
  cabinasSD: CabinaSD[] = [];
  wheelbases: Wheelbases[] = [];
  axleBases: AxleBase[] = [];
  doors: Door[] = [];
  gears: Gear[] = [];
  mCGTotalMkts: MCGTotalMkt[] = [];
  motorsDT: MotorDT[] = [];
  rules: Rule[] = [];
  sources: Source[] = [];
  pbts: PBT[] = [];
  pbtTn: PbtTN[] = [];
  altbodyst: AltBodySt[] = [];
  altcateg: AltCateg[] = [];
  altsegm: AltSegm[] = [];
  aMGCompSet: AmgCompSet[] = [];
  apertura1: ApertureOne[] = [];
  apertura2: ApertureTwo[] = [];
  apertura3: Apertura3[] = [];
  apertura4: Apertura4[] = [];
  cabinaCF: CabinaCF[] = [];
  enginecapacitys: EngineCapacity[] = [];
  cjdcompetitives: CjdCompetitive[] = [];
  competitivecjd: CompetitiveCjd[] = [];
  group: Group[] = [];
  nI: Ni[] = [];
  relevmb: RelevMB[] = [];
  ssegm: Ssegm[] = [];
  segmentationaux1: SegmentationAux1[] = [];
  powers: Power[] = [];
  internalVersionSegmentationAux: InternalVersionSegmentation = new InternalVersionSegmentation();
  internalVersionsAux: CatInternalVersion[] = [];
  categoriesAux: Category[] = [];
  categoryAux: string = '';
  segmentsAux: Segment[] = [];
  filteredSegmentsAux: Segment[] = [];
  bodyworksAux: Bodywork[] = [];
  bodyStylesAux: BodyStyle[] = [];
  subsegmentsAux: Subsegment[] = [];
  usagesAux: Usage[] = [];
  tractionsAux: Traction[] = [];
  fueltypesAux: FuelTypes[] = [];
  cabinasSDAux: CabinaSD[] = [];
  wheelbasesAux: Wheelbases[] = [];
  axleBasesAux: AxleBase[] = [];
  doorsAux: Door[] = [];
  gearsAux: Gear[] = [];
  mCGTotalMktsAux: MCGTotalMkt[] = [];
  motorsDTAux: MotorDT[] = [];
  rulesAux: Rule[] = [];
  sourcesAux: Source[] = [];
  pbtsAux: PBT[] = [];
  pbtTnAux: PbtTN[] = [];
  altbodystAux: AltBodySt[] = [];
  altcategAux: AltCateg[] = [];
  altsegmAux: AltSegm[] = [];
  aMGCompSetAux: AmgCompSet[] = [];
  apertura1Aux: ApertureOne[] = [];
  apertura2Aux: ApertureTwo[] = [];
  apertura3Aux: Apertura3[] = [];
  apertura4Aux: Apertura4[] = [];
  cabinaCFAux: CabinaCF[] = [];
  enginecapacitysAux: EngineCapacity[] = [];
  cjdcompetitivesAux: CjdCompetitive[] = [];
  competitivecjdAux: CompetitiveCjd[] = [];
  groupAux: Group[] = [];
  nIAux: Ni[] = [];
  relevmbAux: RelevMB[] = [];
  ssegmAux: Ssegm[] = [];
  segmentationaux1Aux: SegmentationAux1[] = [];
  mercedesConfiguration: mercedesConfiguration[] = [];
  mercedesConfigurationAux: mercedesConfiguration[] = [];
  powersAux: Power[] = [];
  isLoading = false;
  loadingSelect = false;

  constructor(
    private dialogRef: MatDialogRef<InternalVersionSegmentationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public internalVersionSegmentationService: InternalVersionSegmentationService,
    public breakpointObserver: BreakpointObserver,
    private sweetAlert: SweetAlert2Helper,
    private clipboard: Clipboard
  ) {
    this.setData(data);
    this.setDataAux(data);
    this.filteredSegments = data.internalVersionSegmentation.id ? data.segments : [];
    console.log(`${this.TAG} > constructor > this.internalVersionSegmentation`, this.internalVersionSegmentation);
    console.log(`${this.TAG} > constructor > this.internalVersions`, this.internalVersions);
    console.log(`${this.TAG} > constructor > this.categories`, this.categories);
    console.log(`${this.TAG} > constructor > this.segments`, this.segments);
    console.log(`${this.TAG} > constructor > this.bodyworks`, this.bodyworks);
    console.log(`${this.TAG} > constructor > this.bodyStyles`, this.bodyStyles);
    console.log(`${this.TAG} > constructor > this.subsegments`, this.subsegments);
    console.log(`${this.TAG} > constructor > this.usages`, this.usages);
    console.log(`${this.TAG} > constructor > this.tractions`, this.tractions);
    console.log(`${this.TAG} > constructor > this.powers`, this.powers);
    console.log(`${this.TAG} > constructor > this.configuration`, this.mercedesConfiguration);

    if (this.internalVersionSegmentation.id) {
      this.actionMode = ActionMode.update;
      this.formGroup = this.createFormGroup();
      const segmentId = this.categories.find((c) => c.id === this.internalVersionSegmentation.categoryId);
      this.enabler(segmentId?.segCategory!);
    } else {
      this.actionMode = ActionMode.create;
      this.formGroup = this.createFormGroup();
      this.formGroup.get('segmentId')?.disable();
      this.formGroup.get('dischargeDate')?.disable();
    }
  }
  setData(data: DialogData) {
    this.internalVersions = data.internalVersions;
    this.internalVersionSegmentation = data.internalVersionSegmentation;
    this.categories = data.categories;
    this.segments = data.segments;
    this.bodyworks = data.bodyworks;
    this.bodyStyles = data.bodyStyles;
    this.subsegments = data.subsegments;
    this.usages = data.usages;
    this.tractions = data.tractions;
    this.fueltypes = data.fueltypes;
    this.cabinasSD = data.cabinSDs;
    this.wheelbases = data.wheelbases;
    this.axleBases = data.axlebases;
    this.doors = data.doors;
    this.gears = data.gears;
    this.mCGTotalMkts = data.mcgTotalMkts;
    this.motorsDT = data.motorDTs;
    this.rules = data.catRules;
    this.sources = data.sources;
    this.pbts = data.pbts;
    this.pbtTn = data.pbttns;
    this.altbodyst = data.altBodysts;
    this.altcateg = data.altCategs;
    this.altsegm = data.altSegms;
    this.aMGCompSet = data.amgCompSets;
    this.apertura1 = data.aperturesOne;
    this.apertura2 = data.aperturesTwo;
    this.apertura3 = data.aperturesThree;
    this.apertura4 = data.aperturesFour;
    this.cabinaCF = data.cabinCFs;
    this.enginecapacitys = data.engineCapacitys;
    this.cjdcompetitives = data.cjdCompetitives;
    this.competitivecjd = data.competitiveCJDs;
    this.group = data.groups;
    this.nI = data.nis;
    this.relevmb = data.relevMBs;
    this.ssegm = data.ssegms;
    this.segmentationaux1 = data.segmentationAux1s;
    this.powers = data.powers;
    this.mercedesConfiguration = data.mercedesConfiguration;
  }
  setDataAux(data: DialogData) {
    this.internalVersionSegmentationAux = data.internalVersionSegmentation;
    this.internalVersionsAux = this.internalVersions;
    this.categoriesAux = data.categories;
    this.segmentsAux = data.segments;
    this.bodyworksAux = data.bodyworks;
    this.bodyStylesAux = data.bodyStyles;
    this.subsegmentsAux = data.subsegments;
    this.usagesAux = data.usages;
    this.tractionsAux = data.tractions;
    this.fueltypesAux = data.fueltypes;
    this.cabinasSDAux = data.cabinSDs;
    this.wheelbasesAux = data.wheelbases;
    this.axleBasesAux = data.axlebases;
    this.doorsAux = data.doors;
    this.gearsAux = data.gears;
    this.mCGTotalMktsAux = data.mcgTotalMkts;
    this.motorsDTAux = data.motorDTs;
    this.rulesAux = data.catRules;
    this.sourcesAux = data.sources;
    this.pbtsAux = data.pbts;
    this.pbtTnAux = data.pbttns;
    this.altbodystAux = data.altBodysts;
    this.altcategAux = data.altCategs;
    this.altsegmAux = data.altSegms;
    this.aMGCompSetAux = data.amgCompSets;
    this.apertura1Aux = data.aperturesOne;
    this.apertura2Aux = data.aperturesTwo;
    this.apertura3Aux = data.aperturesThree;
    this.apertura4Aux = data.aperturesFour;
    this.cabinaCFAux = data.cabinCFs;
    this.enginecapacitysAux = data.engineCapacitys;
    this.cjdcompetitivesAux = data.cjdCompetitives;
    this.competitivecjdAux = data.competitiveCJDs;
    this.groupAux = data.groups;
    this.nIAux = data.nis;
    this.relevmbAux = data.relevMBs;
    this.ssegmAux = data.ssegms;
    this.segmentationaux1Aux = data.segmentationAux1s;
    this.powersAux = data.powers;
    this.mercedesConfigurationAux = data.mercedesConfiguration;
  }
  ResetData() {
    this.internalVersionSegmentation = this.internalVersionSegmentationAux;
    this.internalVersions = this.internalVersionsAux;
    this.categories = this.categoriesAux;
    this.segments = this.segmentsAux;
    this.bodyworks = this.bodyworksAux;
    this.bodyStyles = this.bodyStylesAux;
    this.subsegments = this.subsegmentsAux;
    this.usages = this.usagesAux;
    this.tractions = this.tractionsAux;
    this.fueltypes = this.fueltypesAux;
    this.cabinasSD = this.cabinasSDAux;
    this.wheelbases = this.wheelbasesAux;
    this.axleBases = this.axleBasesAux;
    this.doors = this.doorsAux;
    this.gears = this.gearsAux;
    this.mCGTotalMkts = this.mCGTotalMktsAux;
    this.motorsDT = this.motorsDTAux;
    this.rules = this.rulesAux;
    this.sources = this.sourcesAux;
    this.pbts = this.pbtsAux;
    this.pbtTn = this.pbtTnAux;
    this.altbodyst = this.altbodystAux;
    this.altcateg = this.altcategAux;
    this.altsegm = this.altsegmAux;
    this.aMGCompSet = this.aMGCompSetAux;
    this.apertura1 = this.apertura1Aux;
    this.apertura2 = this.apertura2Aux;
    this.apertura3 = this.apertura3Aux;
    this.apertura4 = this.apertura4Aux;
    this.cabinaCF = this.cabinaCFAux;
    this.enginecapacitys = this.enginecapacitysAux;
    this.cjdcompetitives = this.cjdcompetitivesAux;
    this.competitivecjd = this.competitivecjdAux;
    this.group = this.groupAux;
    this.nI = this.nIAux;
    this.relevmb = this.relevmbAux;
    this.ssegm = this.ssegmAux;
    this.segmentationaux1 = this.segmentationaux1Aux;
    this.powers = this.powersAux;
    this.mercedesConfiguration = this.mercedesConfigurationAux;

  }
  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((state: BreakpointState) => {
        console.log( `${this.TAG} > ngOnInit > breakpointObserver > state`, state );
        if (state.matches) {
          this.isXsOrSm = true;
        } else {
          this.isXsOrSm = false;
        }
      });
  }

  createFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group({
      internalVersionId: [
        {
          value: this.internalVersionSegmentation.cat_InternalVersionId ?? null,
          disabled: true,
        },
        [Validators.required, Validators.minLength(3)]
      ],
      mercedesVersionInternaId: [
        {
          value:
            this.internalVersionSegmentation.mercedesVersionInternaId ?? null,
          disabled: true,
        },
        [],
      ],
      categoryId: [
        {
          value: this.internalVersionSegmentation.categoryId ?? null,
          disabled: false,
        },
      ],
      mercedesCategoriaId: [
        {
          value: this.internalVersionSegmentation.mercedesCategoriaId ?? null,
          disabled: false,
        },
      ],
      segmentId: [
        {
          value: this.internalVersionSegmentation.segmentId ?? null,
          disabled: false,
        },
        [],
      ],
      mercedesSegmentoId: [
        {
          value: this.internalVersionSegmentation.mercedesSegmentoId ?? null,
          disabled: true,
        },
        [],
      ],
      dischargeDate: [
        {
          value: this.internalVersionSegmentation.dischargeDate ? new Date(new Date(this.internalVersionSegmentation.dischargeDate).getTime() + (24 * 60 * 60 * 1000)) : null,
          disabled: false,
        },
        [],
      ],
      description: [
        {
          value: this.internalVersionSegmentation.description ?? null,
          disabled: true,
        },
        [],
      ],
      altBodyst: [
        {
          value: this.internalVersionSegmentation.altBodyst?.id ?? null,
          disabled: true,
        },
        [],
      ],
      altCateg: [
        {
          value: this.internalVersionSegmentation.altCateg?.id ?? null,
          disabled: true,
        },
        [],
      ],
      altSegm: [
        {
          value: this.internalVersionSegmentation.altSegm?.id ?? null,
          disabled: true,
        },
        [],
      ],
      aMGCompSet: [
        {
          value: this.internalVersionSegmentation.aMGCompSet?.id ?? null,
          disabled: true,
        },
        [],
      ],
      apertura1: [
        {
          value: this.internalVersionSegmentation.apertura1?.id ?? null,
          disabled: true,
        },
        [],
      ],
      apertura2: [
        {
          value: this.internalVersionSegmentation.apertura2?.id ?? null,
          disabled: true,
        },
        [],
      ],
      apertura3: [
        {
          value: this.internalVersionSegmentation.apertura3?.id ?? null,
          disabled: true,
        },
        [],
      ],
      apertura4: [
        {
          value: this.internalVersionSegmentation.apertura4?.id ?? null,
          disabled: true,
        },
        [],
      ],
      mercedesBodyStyle: [
        {
          value: this.internalVersionSegmentation.mercedesBodyStyle ?? null,
          disabled: true,
        },
        [],
      ],
      bodyStyleId: [
        {
          value: this.internalVersionSegmentation.bodyStyleId ?? null,
          disabled: true,
        },
        [],
      ],
      cabinaCF: [
        {
          value: this.internalVersionSegmentation.cabinaCF?.id ?? null,
          disabled: true,
        },
        [],
      ],
      cabinaSD: [
        {
          value: this.internalVersionSegmentation.cabinaSD?.id ?? null,
          disabled: true,
        },
        [],
      ],
      engineCapacity: [
        {
          value: this.internalVersionSegmentation.engineCapacity?.id ?? null,
          disabled: true,
        },
        [],
      ],
      cJDCompetitive: [
        {
          value: this.internalVersionSegmentation.cJDCompetitive?.id ?? null,
          disabled: true,
        },
        [],
      ],
      fuel: [
        {
          value: this.internalVersionSegmentation.fuelType?.id ?? null,
          disabled: true,
        },
        [],
      ],
      competitiveCJD: [
        {
          value: this.internalVersionSegmentation.competitiveCJD?.id ?? null,
          disabled: true,
        },
        [],
      ],
      mercedesConfiguration: [
        {
          value: this.internalVersionSegmentation.mercedesConfiguration?.id ?? null,
          disabled: true,
        },
        [],
      ],
      bodyworkId: [
        {
          value: this.internalVersionSegmentation.bodyworkId ?? null,
          disabled: true,
        },
        [],
      ],
      wheelbase: [
        {
          value: this.internalVersionSegmentation.wheelbase?.id ?? null,
          disabled: true,
        },
        [],
      ],
      axleBase: [
        {
          value: this.internalVersionSegmentation.axleBase?.id ?? null,
          disabled: true,
        },
        [],
      ],
      group: [
        {
          value: this.internalVersionSegmentation.group?.id ?? null,
          disabled: true,
        },
        [],
      ],
      gears: [
        {
          value: this.internalVersionSegmentation.gears?.id ?? null,
          disabled: true,
        },
        [],
      ],
      mCGTotalMkt: [
        {
          value: this.internalVersionSegmentation.mcgTotalMkt?.id ?? null,
          disabled: true,
        },
        [],
      ],
      motorDT: [
        {
          value: this.internalVersionSegmentation.motorDT?.id ?? null,
          disabled: true,
        },
        [],
      ],
      nI: [
        {
          value: this.internalVersionSegmentation.nI?.id ?? null,
          disabled: true,
        },
        [],
      ],
      rule: [
        {
          value: this.internalVersionSegmentation.catRule?.id ?? null,
          disabled: true,
        },
        [],
      ],
      source: [
        {
          value: this.internalVersionSegmentation.source?.id ?? null,
          disabled: true,
        },
        [],
      ],
      mercedesPBT: [
        {
          value: this.internalVersionSegmentation.mercedesPBT?.id ?? null,
          disabled: true,
        },
        [],
      ],
      subsegmentId: [
        {
          value: this.internalVersionSegmentation.subsegment ?? null,
          disabled: true,
        },
        [],
      ],
      pBT_TN: [
        {
          value: this.internalVersionSegmentation.pbT_TN?.id ?? null,
          disabled: true,
        },
        [],
      ],
      mercedesPower: [
        {
          value: this.internalVersionSegmentation.mercedesPower ?? null,
          disabled: true,
        },
        [],
      ],
      powerId: [
        {
          value: this.internalVersionSegmentation.powerId ?? null,
          disabled: true,
        },
        [],
      ],
      doors: [
        {
          value: this.internalVersionSegmentation.doors?.id ?? null,
          disabled: true,
        },
        [],
      ],
      relevMB: [
        {
          value: this.internalVersionSegmentation.relevMB?.id ?? null,
          disabled: true,
        },
        [],
      ],
      sSegm: [
        {
          value: this.internalVersionSegmentation.sSegm?.id ?? null,
          disabled: true,
        },
        [],
      ],
      mercedesTraction: [
        {
          value: this.internalVersionSegmentation.mercedesTraction ?? null,
          disabled: true,
        },
        [],
      ],
      tractionId: [
        {
          value: this.internalVersionSegmentation.tractionId ?? null,
          disabled: true,
        },
        [],
      ],
      mercedesUsage: [
        {
          value: this.internalVersionSegmentation.mercedesUsage ?? null,
          disabled: true,
        },
        [],
      ],
      usageId: [
        {
          value: this.internalVersionSegmentation.usageId ?? null,
          disabled: true,
        },
        [],
      ],
      segmentationAux1: [
        {
          value: this.internalVersionSegmentation.segmentationAux1?.id ?? null,
          disabled: true,
        },
        [],
      ],
      segmentationAux2: [
        {
          value: this.internalVersionSegmentation.segmentationAux2 ?? null,
          disabled: true,
        },
        [],
      ],
      segmentationAux3: [
        {
          value: this.internalVersionSegmentation.segmentationAux3 ?? null,
          disabled: true,
        },
        [],
      ],
      segmentationAux4: [
        {
          value: this.internalVersionSegmentation.segmentationAux4 ?? null,
          disabled: true,
        },
        [],
      ],
      segmentationAux5: [
        {
          value: this.internalVersionSegmentation.segmentationAux5 ?? null,
          disabled: true,
        },
        [],
      ],
    });
    return formGroup;
  }

  compareFn(v1: any, v2: any): boolean {
    return v1 && v2 ? v1.id === v2.id : v1 === v2;
  }

  searchComparisonFn = (searchTerm: string, option: { codName: string }): boolean => { 
    return option.codName.toLowerCase().includes(searchTerm.toLowerCase());
  };

  close(){
    this.dialogRef.close(false);
  }

  save() {
    this.loading = true;
    this.accept = '';
    const rawValue = this.formGroup.getRawValue();
    console.log(`${this.TAG} > save > rawValue`, rawValue);
    const mInternalVersion = this.internalVersions.find((iv) => iv.id === rawValue.internalVersionId);
    const mCategory = this.categories.find((c) => c.id === rawValue.categoryId);
    const mSegment = this.segments.find((s) => s.id === rawValue.segmentId);
    const mBodyStyle = this.bodyStyles.find((s) => s.id === rawValue.bodyStyleId);
    const mBodywork = this.bodyworks?.find((s) => s.id === rawValue.bodyworkId);
    const mPower = this.powers?.find((s) => s.id === rawValue.powerId);
    const mSubsegment = this.subsegments?.find((s) => s.id === rawValue.subsegmentId);
    const mMercedesConfiguration = this.mercedesConfiguration?.find((s) => s.id === rawValue.mercedesConfiguration);
    const msegmetationaux1 = this.segmentationaux1?.find((s) => s.id === rawValue.segmentationAux1);
    const mrelevmb = this.relevmb?.find((s) => s.id === rawValue.relevMB);
    const mssegm = this.ssegm?.find((s) => s.id === rawValue.ssegm);
    const mcompetitivecdj = this.competitivecjd?.find((s) => s.id === rawValue.competitiveCJD);
    const mgroup = this.group?.find((s) => s.id === rawValue.group);
    const mni = this.nI?.find((s) => s.id === rawValue.nI);
    const mapertura1 = this.apertura1?.find((s) => s.id === rawValue.apertura1);
    const mapertura2 = this.apertura2?.find((s) => s.id === rawValue.apertura2);
    const mapertura3 = this.apertura3?.find((s) => s.id === rawValue.apertura3);
    const mapertura4 = this.apertura4?.find((s) => s.id === rawValue.apertura4);
    const mcabinascf = this.cabinaCF?.find((s) => s.id === rawValue.cabinaCF);
    const menginecapacity = this.enginecapacitys?.find((s) => s.id === rawValue.engineCapacity);
    const mcjdcompetitive = this.cjdcompetitives?.find((s) => s.id === rawValue.cJDCompetitive);
    const maltbodySt = this.altbodyst?.find((s) => s.id === rawValue.altBodyst);
    const maltcateg = this.altcateg?.find((s) => s.id === rawValue.altCateg);
    const maltsegm = this.altsegm?.find((s) => s.id === rawValue.altSegm);
    const maMGCompSet = this.aMGCompSet?.find((s) => s.id === rawValue.aMGCompSet);
    const mpbtsTn = this.pbtTn?.find((s) => s.id === rawValue.pBT_TN);
    const mpbts = this.pbts?.find((s) => s.id === rawValue.pBT);
    const msources = this.sources?.find((s) => s.id === rawValue.source)
    const mrules = this.rules?.find((s) => s.id === rawValue.rule);
    const mMotordt = this.motorsDT?.find((s) => s.id === rawValue.motorDT);
    const mMcgTotalMkt = this.mCGTotalMkts?.find((s) => s.id === rawValue.mCGTotalMkt);
    const mgears = this.gears?.find((s) => s.id === rawValue.gears);
    const mdoors = this.doors?.find((s) => s.id === rawValue.doors);
    const maxleBase = this.axleBases?.find((s) => s.id === rawValue.axleBase);
    const mcabinaSd = this.cabinasSD?.find((s) => s.id === rawValue.cabinaSD);
    const mwheelbase = this.wheelbases?.find((s) => s.id === rawValue.wheelbase);
    const mfuel = this.fueltypes?.find((s) => s.id === rawValue.fuel);
    const mTraction = this.tractions?.find((s) => s.id === rawValue.tractionId);
    const mUsage = this.usages?.find((s) => s.id === rawValue.usageId);
    const createDto: InternalVersionSegmentationCreateDto = {
      id: this.internalVersionSegmentation.id ?? uuidv4(),
      cat_InternalVersion: mInternalVersion?.id ?? '00000000-0000-0000-0000-000000000033',
      cat_InternalVersionId:mInternalVersion?.id ?? '00000000-0000-0000-0000-000000000033',
      mercedesVersionInternaId: typeof mInternalVersion?.version === 'string' && this.internalVersionSegmentation.mercedesVersionInternaId !== mInternalVersion?.version
        ? mInternalVersion?.version : this.internalVersionSegmentation.mercedesVersionInternaId,
      bodyworkId: mBodywork?.id ?? '00000000-0000-0000-0000-000000000033',
      sSegm: mssegm?.id ?? '00000000-0000-0000-0000-000000000033',
      mercedesConfigurationId: mMercedesConfiguration?.id ?? '00000000-0000-0000-0000-000000000033',
      categoryId: mCategory?.id ?? '00000000-0000-0000-0000-000000000033',
      mercedesCategoriaId: mCategory?.segCategory,
      segmentId: rawValue?.segmentId ?? '00000000-0000-0000-0000-000000000033',
      mercedesSegmentoId: mSegment?.segName,
      dischargeDate: this.internalVersionSegmentation.dischargeDate ?? rawValue.dischargeDate,
      description: this.internalVersionSegmentation.description !== rawValue.description
        ? rawValue.description : this.internalVersionSegmentation.description,
      altbodyst: this.internalVersionSegmentation.altBodyst !== maltbodySt?.description
        ? maltbodySt?.description : this.internalVersionSegmentation.altBodyst,
      altBodystId: maltbodySt?.id ?? '00000000-0000-0000-0000-000000000033',
      altCateg: this.internalVersionSegmentation.altCateg !== maltcateg?.description
        ? maltcateg?.description : this.internalVersionSegmentation.altCateg,
      altCategId: maltcateg?.id ?? '00000000-0000-0000-0000-000000000033',
      altsegm: maltsegm?.mercedesAltSegm,
      altsegmId: maltsegm?.id ?? '00000000-0000-0000-0000-000000000033',
      aMGCompSet: this.internalVersionSegmentation.aMGCompSet !== maMGCompSet?.description
        ? maltcateg?.description  : this.internalVersionSegmentation.aMGCompSet,
      amgCompSetId: maMGCompSet?.id ?? '00000000-0000-0000-0000-000000000033',
      apertura1: this.internalVersionSegmentation.apertura1 !== mapertura1?.mercedesApertureOne
        ? mapertura1?.mercedesApertureOne : this.internalVersionSegmentation.apertura1,
      apertura1Id: mapertura1?.id ?? '00000000-0000-0000-0000-000000000033',
      apertura2: this.internalVersionSegmentation.apertura2 !== mapertura2?.mercedesApertureTwo
        ? mapertura2?.mercedesApertureTwo : this.internalVersionSegmentation.apertura2,
      apertura2Id: mapertura2?.id ?? '00000000-0000-0000-0000-000000000033',
      apertura3: this.internalVersionSegmentation.apertura3 !== mapertura3?.mercedesApertureThree
        ? mapertura3?.mercedesApertureThree : this.internalVersionSegmentation.apertura3,
      apertura3Id: mapertura3?.id ?? '00000000-0000-0000-0000-000000000033',
      apertura4: this.internalVersionSegmentation.apertura4 !== mapertura4?.mercedesApertureFour
        ? mapertura4?.mercedesApertureFour : this.internalVersionSegmentation.apertura4,
      apertura4Id: mapertura4?.id ?? '00000000-0000-0000-0000-000000000033',
      mercedesBodyStyle: this.internalVersionSegmentation.mercedesBodyStyle ?? mBodyStyle?.mercedesBodyStyle,
      bodyStyleId: mBodyStyle?.id ?? '00000000-0000-0000-0000-000000000033',
      cabinaCF: this.internalVersionSegmentation.cabinaCF !== mcabinascf?.description
        ? mcabinascf?.description : this.internalVersionSegmentation.cabinaCF,
      cabinaCFId: mcabinascf?.id ?? '00000000-0000-0000-0000-000000000033',
      cabinaSD: this.internalVersionSegmentation.cabinaSD !== mcabinaSd?.description
        ? mcabinaSd?.description : this.internalVersionSegmentation.cabinaSD,
      cabinaSDId: mcabinaSd?.id ?? '00000000-0000-0000-0000-000000000033',
      engineCapacity: this.internalVersionSegmentation.engineCapacity !== menginecapacity?.description
        ? menginecapacity?.description : this.internalVersionSegmentation.engineCapacity,
      engineCapacityId: menginecapacity?.id ?? '00000000-0000-0000-0000-000000000033',
      cJDCompetitive: this.internalVersionSegmentation.cJDCompetitive !== mcjdcompetitive?.description
        ? mcjdcompetitive?.description : this.internalVersionSegmentation.cJDCompetitive,
      cJDCompetitiveId: mcjdcompetitive?.id ?? '00000000-0000-0000-0000-000000000033',
      fuelType: this.internalVersionSegmentation.fuelType !== mfuel?.description
        ? mfuel?.description : this.internalVersionSegmentation.fuelType,
      fuelTypeId: mfuel?.id ?? '00000000-0000-0000-0000-000000000033',
      competitiveCJD: this.internalVersionSegmentation.competitiveCJD !== mcompetitivecdj?.description
        ? mcompetitivecdj?.description : this.internalVersionSegmentation.competitiveCJD,
      competitiveCJDId: mcompetitivecdj?.id ?? '00000000-0000-0000-0000-000000000033',
      mercedesConfiguration: mMercedesConfiguration?.mercedesConfiguration,
      wheelbase: this.internalVersionSegmentation.wheelbase !== mwheelbase?.description
        ? mwheelbase?.description : this.internalVersionSegmentation.wheelbase,
      wheelBaseId: mwheelbase?.id ?? '00000000-0000-0000-0000-000000000033',
      axleBase: this.internalVersionSegmentation.axleBase !== maxleBase?.description
        ? maxleBase?.description : this.internalVersionSegmentation.axleBase,
      axleBaseId: maxleBase?.id ?? '00000000-0000-0000-0000-000000000033',
      group: this.internalVersionSegmentation.group !== mgroup?.description
        ? mgroup?.description : this.internalVersionSegmentation.group,
      groupId: mgroup?.id ?? '00000000-0000-0000-0000-000000000033',
      gears: this.internalVersionSegmentation.gears !== mgears?.description
        ? mgears?.description : this.internalVersionSegmentation.gears,
      gearsId: mgears?.id ?? '00000000-0000-0000-0000-000000000033',
      mCGTotalMkt: this.internalVersionSegmentation.mcgTotalMkt !== mMcgTotalMkt?.description
        ? mMcgTotalMkt?.description : this.internalVersionSegmentation.mcgTotalMkt,
      mCGTotalMktId: mMcgTotalMkt?.id ?? '00000000-0000-0000-0000-000000000033',
      motorDT: this.internalVersionSegmentation.motorDT !== mMotordt?.description
        ? mMotordt?.description : this.internalVersionSegmentation.motorDT,
      motorDTId: mMotordt?.id ?? '00000000-0000-0000-0000-000000000033',
      nI: this.internalVersionSegmentation.nI !== mni?.description
        ? mni?.description : this.internalVersionSegmentation.nI,
      nIId: mni?.id ?? '00000000-0000-0000-0000-000000000033',
      catRule: this.internalVersionSegmentation.catRule !== mrules?.description
        ? mrules?.description : this.internalVersionSegmentation.catRule,
      catRuleId: mrules?.id ?? '00000000-0000-0000-0000-000000000033',
      source: this.internalVersionSegmentation.source !== msources?.description
        ? msources?.description : this.internalVersionSegmentation.source,
      sourceId: msources?.id ?? '00000000-0000-0000-0000-000000000033',
      mercedesPBT: this.internalVersionSegmentation.mercedesPBT !== mpbts?.description
        ? mpbts?.description : this.internalVersionSegmentation.mercedesPBT,
      subSegmentId: mSubsegment?.id ?? '00000000-0000-0000-0000-000000000033',
      pBT_TN: this.internalVersionSegmentation.pbT_TN !== mpbtsTn?.description
        ? mpbtsTn?.description : this.internalVersionSegmentation.pbT_TN,
      pBT_TNId: mpbtsTn?.id ?? '00000000-0000-0000-0000-000000000033',
      mercedesPower: this.internalVersionSegmentation.mercedesPower ?? mPower?.mercedesPower,
      powerId: mPower?.id ?? '00000000-0000-0000-0000-000000000033',
      doors: this.internalVersionSegmentation.doors !== mdoors?.description
        ? mdoors?.description : this.internalVersionSegmentation.doors,
      doorsId: mdoors?.id ?? '00000000-0000-0000-0000-000000000033',
      relevMB: this.internalVersionSegmentation.relevMB !== mrelevmb?.description
        ? mrelevmb?.description : this.internalVersionSegmentation.relevMB,
      relevMBId: mrelevmb?.id ?? '00000000-0000-0000-0000-000000000033',
      mercedesTraction: this.internalVersionSegmentation.mercedesTraction !== mTraction?.description
        ? mTraction?.description : this.internalVersionSegmentation.mercedesTraction,
      tractionId: mTraction?.id ?? '00000000-0000-0000-0000-000000000033',
      mercedesUsage: this.internalVersionSegmentation.mercedesUsage ?? mUsage?.mercedesUsage,
      usageId: mUsage?.id ?? '00000000-0000-0000-0000-000000000033',
      segmentationAux1: this.internalVersionSegmentation.segmentationAux1 !== msegmetationaux1?.description
        ? msegmetationaux1?.description : this.internalVersionSegmentation.segmentationAux1,
      segmentationAux1Id: msegmetationaux1?.id ?? '00000000-0000-0000-0000-000000000033',
      segmentationAux2: this.internalVersionSegmentation.segmentationAux2 ?? rawValue.segmentationAux2,
      segmentationAux3: this.internalVersionSegmentation.segmentationAux3 ?? rawValue.segmentationAux3,
      segmentationAux4: this.internalVersionSegmentation.segmentationAux4 ?? rawValue.segmentationAux4,
      segmentationAux5: this.internalVersionSegmentation.segmentationAux5 ?? rawValue.segmentationAux5,
      segmentationAux2Id: this.internalVersionSegmentation.segmentationAux2Id ?? '00000000-0000-0000-0000-000000000033',
      segmentationAux3Id: this.internalVersionSegmentation.segmentationAux3Id ?? '00000000-0000-0000-0000-000000000033',
      segmentationAux4Id: this.internalVersionSegmentation.segmentationAux4Id ?? '00000000-0000-0000-0000-000000000033',
      segmentationAux5Id: this.internalVersionSegmentation.segmentationAux5Id ?? '00000000-0000-0000-0000-000000000033',
    };
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', createDto.mercedesVersionInternaId);
    console.log('createDto', createDto);
    if (this.actionMode === ActionMode.create) {
      this.create(createDto);
    }
    if (this.actionMode === ActionMode.update) {
      this.update(createDto);
    }
  }

  create(createDto: InternalVersionSegmentationCreateDto): void {
    this.internalVersionSegmentationService.create(createDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Versión interna segmentación guardada con éxito!',
        });
      },
      error: (err) => {
        this.loading = false;
        this.accept = 'Guardar';
        console.error(`${this.TAG} > save > create > err`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  update(updateDto: InternalVersionSegmentationCreateDto): void {
    this.internalVersionSegmentationService.update(updateDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Versión interna segmentación actualizada con éxito!',
        });
      },
      error: (err) => {
        this.loading = false;
        this.accept = 'Guardar';
        console.error(`${this.TAG} > save > update > err`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }
  filterCatalogbySegcategory(catalogs: string) {
    this.ResetData();
    if (catalogs !== '') {
      this.filteredSegments = this.filteredSegments.filter((fs) => fs.mercedesCategoriaId === catalogs).sort((a, b) => a.segName!.localeCompare(b.segName!));
      let uniqueMercedesSet = new Set<string>();
      this.cabinasSD = this.cabinasSD.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesCabinSD).size).sort((a, b) => a.mercedesCabinSD!.localeCompare(b.mercedesCabinSD!));
      uniqueMercedesSet = new Set<string>();
      this.rules = this.rules.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesCatRule).size).sort((a, b) => a.mercedesCatRule!.localeCompare(b.mercedesCatRule!));
      uniqueMercedesSet = new Set<string>();
      this.bodyStyles = this.bodyStyles.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesBodyStyle).size).sort((a, b) => a.mercedesBodyStyle!.localeCompare(b.mercedesBodyStyle!));
      uniqueMercedesSet = new Set<string>();
      this.bodyworks = this.bodyworks.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesBodywork).size).sort((a, b) => a.mercedesBodywork!.localeCompare(b.mercedesBodywork!));
      uniqueMercedesSet = new Set<string>();
      this.subsegments = this.subsegments.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesSubsegment).size).sort((a, b) => a.mercedesSubsegment!.localeCompare(b.mercedesSubsegment!));
      uniqueMercedesSet = new Set<string>();
      this.usages = this.usages.filter(s => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesUsage).size).sort((a, b) => a.mercedesUsage!.localeCompare(b.mercedesUsage!));
      uniqueMercedesSet = new Set<string>();
      this.tractions = this.tractions.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesTraction).size).sort((a, b) => a.mercedesTraction!.localeCompare(b.mercedesTraction!));
      uniqueMercedesSet = new Set<string>();
      this.fueltypes = this.fueltypes.filter(s => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesFuelType).size).sort((a, b) => a.mercedesFuelType!.localeCompare(b.mercedesFuelType!));
      uniqueMercedesSet = new Set<string>();
      this.wheelbases = this.wheelbases.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesWheelBase).size).sort((a, b) => a.mercedesWheelBase!.localeCompare(b.mercedesWheelBase!));
      uniqueMercedesSet = new Set<string>();
      this.axleBases = this.axleBases.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesAxleBase).size).sort((a, b) => a.mercedesAxleBase!.localeCompare(b.mercedesAxleBase!));
      uniqueMercedesSet = new Set<string>();
      this.doors = this.doors.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesDoor).size).sort((a, b) => a.mercedesDoor!.localeCompare(b.mercedesDoor!));
      uniqueMercedesSet = new Set<string>();
      this.gears = this.gears.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesGear).size).sort((a, b) => a.mercedesGear!.localeCompare(b.mercedesGear!));
      uniqueMercedesSet = new Set<string>();
      this.mCGTotalMkts = this.mCGTotalMkts.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesMCGTotalMkt).size).sort((a, b) => a.mercedesMCGTotalMkt!.localeCompare(b.mercedesMCGTotalMkt!));
      uniqueMercedesSet = new Set<string>();
      this.motorsDT = this.motorsDT.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesMotorDT).size).sort((a, b) => a.mercedesMotorDT!.localeCompare(b.mercedesMotorDT!));
      uniqueMercedesSet = new Set<string>();
      this.sources = this.sources.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesSource).size).sort((a, b) => a.mercedesSource!.localeCompare(b.mercedesSource!));
      uniqueMercedesSet = new Set<string>();
      this.pbts = this.pbts.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesPBT).size).sort((a, b) => a.mercedesPBT!.localeCompare(b.mercedesPBT!));
      uniqueMercedesSet = new Set<string>();
      this.pbtTn = this.pbtTn.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesPBTTN).size).sort((a, b) => a.mercedesPBTTN!.localeCompare(b.mercedesPBTTN!));
      uniqueMercedesSet = new Set<string>();
      this.altbodyst = this.altbodyst.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesAltBodyst).size).sort((a, b) => a.mercedesAltBodyst!.localeCompare(b.mercedesAltBodyst!));
      uniqueMercedesSet = new Set<string>();
      this.altcateg = this.altcateg?.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesAltCateg).size).sort((a, b) => a.mercedesAltCateg!.localeCompare(b.mercedesAltCateg!));
      uniqueMercedesSet = new Set<string>();
      this.altsegm = this.altsegm?.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesAltSegm).size).sort((a, b) => a.mercedesAltSegm!.localeCompare(b.mercedesAltSegm!));
      uniqueMercedesSet = new Set<string>();
      this.aMGCompSet = this.aMGCompSet?.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesAMGCompSet).size).sort((a, b) => a.mercedesAMGCompSet!.localeCompare(b.mercedesAMGCompSet!));
      uniqueMercedesSet = new Set<string>();
      this.apertura3 = this.apertura3?.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesApertureThree).size).sort((a, b) => a.mercedesApertureThree!.localeCompare(b.mercedesApertureThree!));
      uniqueMercedesSet = new Set<string>();
      this.apertura4 = this.apertura4.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesApertureFour).size).sort((a, b) => a.mercedesApertureFour!.localeCompare(b.mercedesApertureFour!));
      uniqueMercedesSet = new Set<string>();
      this.cabinaCF = this.cabinaCF.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesCabinCF).size).sort((a, b) => a.mercedesCabinCF!.localeCompare(b.mercedesCabinCF!));
      uniqueMercedesSet = new Set<string>();
      this.enginecapacitys = this.enginecapacitys.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesEngineCapacity).size).sort((a, b) => a.mercedesEngineCapacity!.localeCompare(b.mercedesEngineCapacity!));
      uniqueMercedesSet = new Set<string>();
      this.cjdcompetitives = this.cjdcompetitives.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesCJDCompetitive).size).sort((a, b) => a.mercedesCJDCompetitive!.localeCompare(b.mercedesCJDCompetitive!));
      uniqueMercedesSet = new Set<string>();
      this.competitivecjd = this.competitivecjd.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesCompetitiveCJD).size).sort((a, b) => a.mercedesCompetitiveCJD!.localeCompare(b.mercedesCompetitiveCJD!));
      uniqueMercedesSet = new Set<string>();
      this.group = this.group.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesGroup).size).sort((a, b) => a.mercedesGroup!.localeCompare(b.mercedesGroup!));
      uniqueMercedesSet = new Set<string>();
      this.nI = this.nI.filter((s) => s.segCategory === catalogs.toLowerCase() && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesNI).size).sort((a, b) => a.mercedesNI!.localeCompare(b.mercedesNI!));
      uniqueMercedesSet = new Set<string>();
      this.relevmb = this.relevmb.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesRelevMB).size).sort((a, b) => a.mercedesRelevMB!.localeCompare(b.mercedesRelevMB!));
      uniqueMercedesSet = new Set<string>();
      this.ssegm = this.ssegm.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesSSegm).size).sort((a, b) => a.mercedesSSegm!.localeCompare(b.mercedesSSegm!));
      uniqueMercedesSet = new Set<string>();
      this.segmentationaux1 = this.segmentationaux1.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesSegmentationAux1).size).sort((a, b) => a.mercedesSegmentationAux1!.localeCompare(b.mercedesSegmentationAux1!));
      uniqueMercedesSet = new Set<string>();
      this.powers = this.powers.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesPower).size).sort((a, b) => a.mercedesPower!.localeCompare(b.mercedesPower!));
      uniqueMercedesSet = new Set<string>();
      this.apertura1 = this.apertura1.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesApertureOne).size).sort((a, b) => a.mercedesApertureOne!.localeCompare(b.mercedesApertureOne!));
      uniqueMercedesSet = new Set<string>();
      this.apertura2 = this.apertura2.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesApertureTwo).size).sort((a, b) => a.mercedesApertureTwo!.localeCompare(b.mercedesApertureTwo!));
      uniqueMercedesSet = new Set<string>();
      this.mercedesConfiguration = this.mercedesConfiguration.filter((s) => s.segCategory === catalogs && uniqueMercedesSet.size !== uniqueMercedesSet.add(s.mercedesConfiguration).size).sort((a, b) => a.mercedesConfiguration!.localeCompare(b.mercedesConfiguration!));
    }
  }

  filterSegments(event: NgxMatSelectionChangeEvent) {
    this.categoryId = event.value as string;
    const category = this.categories.find((c) => event.value == c.id);
    this.filteredSegments = this.segments.filter( (s) => category?.segCategory == s.mercedesCategoriaId).sort((a, b) => a.segName!.localeCompare(b.segName!));
    const segCategory = category?.segCategory;
    if (this.filterSegments.length === 0) {
      this.formGroup.get('segmentId')?.setValue(null);
    }
    this.formGroup.disable();
    this.formGroup.get('internalVersionId')?.enable();
    this.formGroup.get('mercedesVersionInternaId')?.enable();
    this.formGroup.get('categoryId')?.enable();
    this.formGroup.get('mercedesCategoriaId')?.enable();
    this.formGroup.get('segmentId')?.enable();
    this.formGroup.get('mercedesSegmentoId')?.enable();
    this.formGroup.get('dischargeDate')?.enable();
    this.formGroup.get('description')?.enable();
    this.enabler(segCategory!);
  }

  enabler(segCategory: string) { 
    switch (segCategory.toLowerCase()) {
      case '001':
        this.dialogRef.updateSize('90%', this.isXsOrSm ? '90%' : '70%');
        this.formGroup.get('altSegm')?.enable();
        this.formGroup.get('tractionId')?.enable();
        this.formGroup.get('doors')?.enable();
        this.formGroup.get('fuel')?.enable();
        this.formGroup.get('relevMB')?.enable();
        this.formGroup.get('apertura2')?.enable();
        this.formGroup.get('bodyStyleId')?.enable();
        this.formGroup.get('mCGTotalMkt')?.enable();
        this.formGroup.get('rule')?.enable();
        this.formGroup.get('source')?.enable();
        break;
      case '002':
        this.dialogRef.updateSize('90%', this.isXsOrSm ? '90%' : '70%');
        this.formGroup.get('altSegm')?.enable();
        this.formGroup.get('tractionId')?.enable();
        this.formGroup.get('doors')?.enable();
        // this.formGroup.get('bodyworkId')?.enable();
        this.formGroup.get('mercedesConfiguration')?.enable();
        this.formGroup.get('fuel')?.enable();
        this.formGroup.get('relevMB')?.enable();
        this.formGroup.get('apertura2')?.enable();
        this.formGroup.get('bodyStyleId')?.enable();
        this.formGroup.get('mCGTotalMkt')?.enable();
        this.formGroup.get('rule')?.enable();
        this.formGroup.get('source')?.enable();
        break;
      case '003':
        this.dialogRef.updateSize('90%', this.isXsOrSm ? '90%' : '80%');
        this.formGroup.get('tractionId')?.enable();
        // this.formGroup.get('bodyworkId')?.enable();
        this.formGroup.get('mercedesConfiguration')?.enable();
        this.formGroup.get('fuel')?.enable();
        // this.formGroup.get('apertura2')?.enable();
        this.formGroup.get('subsegmentId')?.enable();
        this.formGroup.get('cabinaSD')?.enable();
        this.formGroup.get('axleBase')?.enable();
        // this.formGroup.get('mCGTotalMkt')?.enable();
        this.formGroup.get('rule')?.enable();
        this.formGroup.get('source')?.enable();
        this.formGroup.get('pBT_TN')?.enable();
        this.formGroup.get('powerId')?.enable();
        this.formGroup.get('segmentationAux1')?.enable();
        this.formGroup.get('usageId')?.enable();
        break;
      case '004':
        this.dialogRef.updateSize('90%', this.isXsOrSm ? '90%' : '70%');
        this.formGroup.get('tractionId')?.enable();
        //  this.formGroup.get('bodyworkId')?.enable();
         this.formGroup.get('mercedesConfiguration')?.enable();
        this.formGroup.get('fuel')?.enable();
        // this.formGroup.get('apertura2')?.enable();
        this.formGroup.get('bodyStyleId')?.enable();
        this.formGroup.get('axleBase')?.enable();
        // this.formGroup.get('mCGTotalMkt')?.enable();
        this.formGroup.get('rule')?.enable();
        this.formGroup.get('source')?.enable();
        this.formGroup.get('pBT_TN')?.enable();
        this.formGroup.get('powerId')?.enable();
        break;
      case '007':
        this.dialogRef.updateSize('90%', this.isXsOrSm ? '90%' : '50%');
        this.formGroup.get('apertura1')?.enable();
        this.formGroup.get('apertura2')?.enable();
        this.formGroup.get('apertura3')?.enable();
        this.formGroup.get('source')?.enable();
        break;
      case '008':
      case 'cas':
      case 'mod':
      case 'mot':
      case 'sub':
      case 'tr1':
      case 'tra':
      case 'uni':
      case 'vol':
        this.dialogRef.updateSize('90%', this.isXsOrSm ? '90%' : '50%');
        this.formGroup.get('nI')?.enable();
        break;
      default:
        this.dialogRef.updateSize('90%', '95%');
        this.formGroup.enable();
        break;
    }
    this.filterCatalogbySegcategory(segCategory);
  }

  copyDto() {
    const rawValue = this.formGroup.getRawValue();
    const json = JSON.stringify(rawValue);
    this.clipboard.copy(json);
    console.log(`${this.TAG} > copyDto > rawValue`, rawValue);
  }

  async pasteDto() {
    this.filteredSegments = this.segments;
    let jsonParsed: any;
    try {
      const clipboard = await navigator.clipboard.readText();
      try {
        jsonParsed = JSON.parse(clipboard);
      } catch (e) {
        this.sweetAlert.error(
          '¡Ha ocurrido un error!',
          'Primero debes copiar una segmentación.',
          null,
          true
        );
      }
    } catch (error) {
      this.sweetAlert.error(
        '¡Ha ocurrido un error!',
        'Primero debes copiar una segmentación.',
        null,
        true
      );
    }
    console.log('clipboard', jsonParsed);
    const category = this.categories.find((c) => jsonParsed.categoryId == c.id);
    this.filteredSegments = this.segments.filter( (s) => category?.segCategory == s.mercedesCategoriaId).sort((a, b) => a.segName!.localeCompare(b.segName!));
    const segCategory = category?.segCategory;
    this.enabler(segCategory!);
    this.formGroup.setValue({
      internalVersionId: jsonParsed.internalVersionId ?? '00000000-0000-0000-0000-000000000033',
      mercedesVersionInternaId: jsonParsed?.mercedesVersionInternaId ?? '',
      categoryId: jsonParsed.categoryId ?? '00000000-0000-0000-0000-000000000033',
      mercedesCategoriaId: jsonParsed?.mercedesCategoriaId ?? '',
      segmentId: jsonParsed.segmentId ?? '00000000-0000-0000-0000-000000000033',
      mercedesSegmentoId: jsonParsed?.mercedesSegmentoId ?? '',
      dischargeDate: jsonParsed.dischargeDate ?? new Date(),
      description: jsonParsed.description ?? '',
      altBodyst: jsonParsed.altBodyst ?? '00000000-0000-0000-0000-000000000033',
      altCateg: jsonParsed.altCateg ?? '00000000-0000-0000-0000-000000000033',
      altSegm: jsonParsed.altSegm ?? '00000000-0000-0000-0000-000000000033',
      aMGCompSet: jsonParsed.aMGCompSet ?? '00000000-0000-0000-0000-000000000033',
      apertura1: jsonParsed.apertura1 ?? '00000000-0000-0000-0000-000000000033',
      apertura2: jsonParsed.apertura2 ?? '00000000-0000-0000-0000-000000000033',
      apertura3: jsonParsed.apertura3 ?? '00000000-0000-0000-0000-000000000033',
      apertura4: jsonParsed.apertura4 ?? '00000000-0000-0000-0000-000000000033',
      mercedesBodyStyle: jsonParsed.mercedesBodyStyle ?? '',
      bodyStyleId: jsonParsed.bodyStyleId ?? '00000000-0000-0000-0000-000000000033',
      cabinaCF: jsonParsed.cabinaCF ?? '00000000-0000-0000-0000-000000000033',
      cabinaSD: jsonParsed.cabinaSD ?? '00000000-0000-0000-0000-000000000033',
      engineCapacity: jsonParsed.engineCapacity ?? '00000000-0000-0000-0000-000000000033',
      cJDCompetitive: jsonParsed.cJDCompetitive ?? '00000000-0000-0000-0000-000000000033',
      fuel: jsonParsed.fuel ?? '00000000-0000-0000-0000-000000000033',
      competitiveCJD: jsonParsed.competitiveCJD ?? '00000000-0000-0000-0000-000000000033',
      mercedesConfiguration: jsonParsed.mercedesConfiguration ?? '',
      bodyworkId: jsonParsed.bodyworkId ?? '00000000-0000-0000-0000-000000000033',
      wheelbase: jsonParsed.wheelbase ?? '00000000-0000-0000-0000-000000000033',
      axleBase: jsonParsed.axleBase ?? '00000000-0000-0000-0000-000000000033',
      group: jsonParsed.group ?? '00000000-0000-0000-0000-000000000033',
      gears: jsonParsed.gears ?? '00000000-0000-0000-0000-000000000033',
      mCGTotalMkt: jsonParsed.mcgTotalMkt ?? '00000000-0000-0000-0000-000000000033',
      motorDT: jsonParsed.motorDT ?? '00000000-0000-0000-0000-000000000033',
      nI: jsonParsed.nI ?? '00000000-0000-0000-0000-000000000033',
      rule: jsonParsed.catRule ?? '00000000-0000-0000-0000-000000000033',
      source: jsonParsed.source ?? '00000000-0000-0000-0000-000000000033',
      mercedesPBT: jsonParsed.mercedesPBT ?? '',
      subsegmentId: jsonParsed.subsegmentId ?? '00000000-0000-0000-0000-000000000033',
      pBT_TN: jsonParsed.pBT_TN ?? '00000000-0000-0000-0000-000000000033',
      mercedesPower: jsonParsed.mercedesPower ?? '',
      powerId: jsonParsed.powerId ?? '00000000-0000-0000-0000-000000000033',
      doors: jsonParsed.doors ?? '00000000-0000-0000-0000-000000000033',
      relevMB: jsonParsed.relevMB ?? '00000000-0000-0000-0000-000000000033',
      sSegm: jsonParsed.sSegm ?? '00000000-0000-0000-0000-000000000033',
      mercedesTraction: jsonParsed.mercedesTraction ?? '',
      tractionId: jsonParsed.tractionId ?? '00000000-0000-0000-0000-000000000033',
      mercedesUsage: jsonParsed.mercedesUsage ?? '',
      usageId: jsonParsed.usageId ?? '00000000-0000-0000-0000-000000000033',
      segmentationAux1: jsonParsed.segmentationAux1 ?? '00000000-0000-0000-0000-000000000033',
      segmentationAux2: jsonParsed.segmentationAux2 ?? '',
      segmentationAux3: jsonParsed.segmentationAux3 ?? '',
      segmentationAux4: jsonParsed.segmentationAux4 ?? '',
      segmentationAux5: jsonParsed.segmentationAux5 ?? '',
    });
  }
}
