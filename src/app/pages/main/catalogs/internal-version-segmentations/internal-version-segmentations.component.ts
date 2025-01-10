import { BreakpointObserver, Breakpoints, BreakpointState, } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import screenfull from 'screenfull';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { BodyStyle } from 'src/app/models/body-styles/body-style.model';
import { Bodywork } from 'src/app/models/bodyworks/bodywork.model';
import { Category } from 'src/app/models/categories/category.model';
import { InternalVersionSegmentation } from 'src/app/models/internal-version-segmentations/internal-version-segmentation.model'; 
import { Power } from 'src/app/models/powers/power.model';
import { Segment } from 'src/app/models/segments/segment.model';
import { Subsegment } from 'src/app/models/subsegments/subsegment.model';
import { Traction } from 'src/app/models/tractions/traction.model';
import { Usage } from 'src/app/models/usages/usage.model';
import { AuthService } from 'src/app/services/auth/auth.service'; 
import { InternalVersionSegmentationService } from 'src/app/services/internal-version-segmentations/internal-version-segmentation.service'; 
import { v4 as uuidv4 } from 'uuid';
import { InternalVersionSegmentationDialogComponent } from './internal-version-segmentation-dialog/internal-version-segmentation-dialog.component'; 
import { FuelTypes } from 'src/app/models/fuel/fuel.model';
import { CabinaSD } from 'src/app/models/cabinaSD/cabinaSD.model';
import { Wheelbases } from 'src/app/models/wheelbases/wheelbases.model';
import { AxleBase } from 'src/app/models/axlebase/axlebase.model';
import { Door } from 'src/app/models/door/door.model';
import { MCGTotalMkt } from 'src/app/models/mCGTotalMkt/mcgtotalmkt.model';
import { MotorDT } from 'src/app/models/motordt/motordt.model';
import { Rule } from 'src/app/models/rule/rule.model';
import { Source } from 'src/app/models/source/source.model';
import { PBT } from 'src/app/models/pbt/pbt.model';
import { PbtTN } from 'src/app/models/pbtTn/pbtTn.model';
import { AltSegm } from 'src/app/models/altsegm/altsegm.model';
import { AltBodySt } from 'src/app/models/altbodyst/altbodyst.model';
import { AmgCompSet } from 'src/app/models/amgcompset/amgcompset.model';
import { AltCateg } from 'src/app/models/altcateg/altcateg.model';
import { Apertura3 } from 'src/app/models/apertures-three/aperture-three.model';
import { Apertura4 } from 'src/app/models/apertures-four/aperture-four.model';
import { CabinaCF } from 'src/app/models/cabinaCF/cabinaCF.model';
import { CjdCompetitive } from 'src/app/models/cjdcompetitive/cjdcompetitive.model';
import { EngineCapacity } from 'src/app/models/enginecapacity/enginecapacity.model';
import { Group } from 'src/app/models/group/group.model';
import { Ni } from 'src/app/models/nI/nI.model';
import { CompetitiveCjd } from 'src/app/models/competitivecdj/competitivecdj.model';
import { RelevMB } from 'src/app/models/relevMB/relevMb';
import { Ssegm } from 'src/app/models/ssegm/ssegm';
import { SegmentationAux1 } from 'src/app/models/segmentationAux1/segmetationaux1';
import { Gear } from 'src/app/models/gear/gear.model';
import { ApertureOne } from 'src/app/models/apertures-one/aperture-one.model';
import { ApertureTwo } from 'src/app/models/apertures-two/aperture-two.model';
import { CatInternalVersion } from 'src/app/models/cat-internal-versions/cat-internal-versions.model';
import { mercedesConfiguration } from 'src/app/models/mercedesConfiguration/mercedesconfiguration.model';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-internal-version-segmentations',
  templateUrl: './internal-version-segmentations.component.html',
  styleUrls: ['./internal-version-segmentations.component.scss'],
})
export class InternalVersionSegmentationsComponent implements OnInit {
  TAG = InternalVersionSegmentationsComponent.name;
  private unsubscribeAll: Subject<any>;
  actionMode = ActionMode;
  internalVersionSegmentations: InternalVersionSegmentation[] = [];
  internalVersions: CatInternalVersion[] = [];
  categories: Category[] = [];
  segments: Segment[] = [];
  bodyworks: Bodywork[] = [];
  mercedesConfiguration: mercedesConfiguration[] = [];
  bodyStyles: BodyStyle[] = [];
  subsegments: Subsegment[] = [];
  usages: Usage[] = [];
  tractions: Traction[] = [];
  fueltypes:FuelTypes[]=[];
  cabinasSD:CabinaSD[]=[];
  cabinasCF:CabinaCF[]=[];
  cJDCompetitive:CjdCompetitive[]=[];
  engineCapacity:EngineCapacity[]=[];
  gears:Gear[]=[];
  wheelbases:Wheelbases[]=[];
  axlebases:AxleBase[]=[];
  powers: Power[] = [];
  rule:Rule[]=[];
  doors:Door[]=[];
  mCGTotalMkt:MCGTotalMkt[]=[];
  motorDt:MotorDT[]=[];
  source:Source[]=[];
  pbt:PBT[]=[];
  pbtTn:PbtTN[]=[];
  altbodyst:AltBodySt[]=[];
  altcateg:AltCateg[]=[];
  altsegm:AltSegm[]=[];
  amgcompset:AmgCompSet[]=[];
  apertura1:ApertureOne[]=[];
  apertura2:ApertureTwo[]=[];
  apertura3:Apertura3[]=[];
  apertura4:Apertura4[]=[];
  group:Group[]=[];
  competitiveCJD:CompetitiveCjd[]=[];
  nI:Ni[]=[];
  segmentationAux1:SegmentationAux1[]=[];
  relevMb:RelevMB[]=[];
  ssegm:Ssegm[]=[];
  isXsOrSm = false;
  isLoading = true;
  fullScreen = {
    isEnabled: false,
    isFullscreen: false,
  };
  pageSize: number = 8;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'acciones',
    'mercedesVersionInternaId',    
    'description',
    'mercedesCategoria',
    'mercedesSegmento',
    'dateFrom',
    'dateTo',
    //'dischargeDate',
    'altBodyst',
    'altCateg',
    'altSegm',
    'aMGCompSet',
    'apertura1',
    'apertura2',
    'apertura3',
    'apertura4',
    'bodyStyle',
    'cabinaCF',
    'cabinaSD',
    'engineCapacity',
    'cJDCompetitive',
    'fuel',
    'competitiveCJD',
    'configuration',
    'wheelbase',
    'axleBase',
    'group',
    'gears',
    'mCGTotalMkt',
    'motorDT',
    'nI',
    'rule',
    'source',
    'pBT',
    'pBT_TN',
    'power',
    'doors',
    'relevMB',
    'sSegm',
    'traction',
    'usage',
    'segmentationAux1',
    'segmentationAux2',
    'segmentationAux3',
    'segmentationAux4',
    'segmentationAux5',
    
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialog: MatDialog,
    private sweetAlert: SweetAlert2Helper,
    public breakpointObserver: BreakpointObserver,
    private internalVersionSegmentationService: InternalVersionSegmentationService,
    private authService: AuthService
  ) {
    this.unsubscribeAll = new Subject();
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
    this.getData();
  }

  getData(): void {
    this.isLoading = true;
    const $combineLatest = combineLatest([this.internalVersionSegmentationService.getAll(),]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([internalVersionSegmentations]) => {
        console.log( `${this.TAG} > getData > internalVersionSegmentations`, internalVersionSegmentations);
        this.internalVersionSegmentations = internalVersionSegmentations;
        this.dataSource = new MatTableDataSource<any>(this.internalVersionSegmentations);
        this.dataSource.paginator = this.paginator;

        


        this.sortAndPaginate();
        this.dataSource.filterPredicate = function ( data, filter: string ): boolean {
          //console.log("AAAAAAAAAA ", data.cat_InternalVersion.description); 
          
          return ((data.mercedesVersionInternaId && data.mercedesVersionInternaId.toLowerCase().includes(filter)) ||
          (data.cat_InternalVersion.description && data.cat_InternalVersion.description.toLowerCase().includes(filter)) ||
          (data.mercedesCategoriaId && data.mercedesCategoriaId.toLowerCase().includes(filter)) ||
          (data.mercedesSegmentoId && data.mercedesSegmentoId.toLowerCase().includes(filter)) ||
          (data.mercedesConfiguration.description && data.mercedesConfiguration.description.toLowerCase().includes(filter)) 
          // (data.dischargeDate &&  data.dischargeDate.toString().slice(8, 10) + '/' + data.dischargeDate.toString().slice(5, 7) === filter)
            
            // ||
            //  ||
            // data.altBodyst.mercedesAltBodyst.toLowerCase().includes(filter) ||
            // data.altCateg.mercedesAltCateg.toLowerCase().includes(filter) ||
            // data.altSegm.mercedesAltSegm.toLowerCase().includes(filter) || 
            // data.apertura1.mercedesApertureOne.toLowerCase().includes(filter)  || 
            // data.apertura2.mercedesApertureTwo.toLowerCase().includes(filter) ||
            // data.apertura3.mercedesApertureThree.toLowerCase().includes(filter) ||
            // data.apertura4.mercedesApertureFour.toLowerCase().includes(filter) ||
            // data.bodyStyle.mercedesBodyStyle.toLowerCase().includes(filter) ||
            // data.cabinaCF.mercedesCabinCF.toLowerCase().includes(filter) ||  
            // data.cabinaSD.mercedesCabinSD.toLowerCase().includes(filter) ||
            // data.engineCapacity.mercedesEngineCapacity.toLowerCase().includes(filter) ||
            // data.fuelType.mercedesFuelType.toLowerCase().includes(filter) ||
            // data.competitiveCJD.mercedesCompetitiveCJD.toLowerCase().includes(filter) || 
            // data.mercedesConfiguration.mercedesConfiguration.toLowerCase().includes(filter) ||
            // data.wheelBase.mercedesWheelBase.toLowerCase().includes(filter) || 
            // data.axleBase.mercedesAxleBase.toLowerCase().includes(filter) ||
            // data.group.mercedesGroup.toLowerCase().includes(filter) ||
            // data.cabinaSD.mercedesCabinSD.toLowerCase().includes(filter) ||
            // data.gears.mercedesGear.toLowerCase().includes(filter) ||
            // data.mcgTotalMkt.mercedesMCGTotalMkt.toLowerCase().includes(filter) ||
            // data.motorDT.mercedesMotorDT.toLowerCase().includes(filter) ||
            // data.ni.mercedesNI.toLowerCase().includes(filter) ||
            // data.catRule.mercedesCatRule.toLowerCase().includes(filter) ||
            // data.source.mercedesSource.toLowerCase().includes(filter) ||
            // data.pbT_TN.mercedesPBTTN.toLowerCase().includes(filter) ||
            // data.power.mercedesPower .toLowerCase().includes(filter) ||
            // data.doors.mercedesDoor.toLowerCase().includes(filter) ||
            // data.relevMB.mercedesRelevMB.toLowerCase().includes(filter) ||
            // data.sSegm.mercedesSSegm.toLowerCase().includes(filter) ||
            // data.traction.mercedesTraction.toLowerCase().includes(filter) ||
            // data.usage.mercedesUsage.toLowerCase().includes(filter) ||
            // data.segmentationAux1.mercedesSegmentationAux1.toLowerCase().includes(filter) 



            //data.cjdCompetitive.toLowerCase().includes(filter) ||
             //data.cjdCompetitive.toLowerCase().includes(filter) ||
            //data.mercedesPBT.toLowerCase().includes(filter) ||
            //data.aMGCompSet.toLowerCase().includes(filter) ||
            //data.segmentationAux2.toLowerCase().includes(filter) ||
            //data.segmentationAux3.toLowerCase().includes(filter) ||
            //data.segmentationAux4.toLowerCase().includes(filter) ||
            //data.segmentationAux5.toLowerCase().includes(filter) 
            );
          };
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`category > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  sortAndPaginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'terminal_id':
          return item.terminal.mercedesTerminalId;
        case 'terminal_name':
          return item.terminal.name;
        default:
          return item[property];
      }
    };
  }

  createOrUpdate(
    internalVersionSegmentationObject?: InternalVersionSegmentation
  ) {
    this.isLoading = true;
    const $combineLatest = combineLatest([
      this.internalVersionSegmentationService.getCatalogs(),
    ]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([catalogs]) => {
        console.log(`${this.TAG} > getData > catalogs`, catalogs);
        catalogs?.internalVersions.forEach((iv) => {
          iv.codName = `(${iv.version}) ${iv.description}`; 
          
        });
        this.internalVersions = catalogs?.internalVersions!;
        catalogs?.categories.forEach((c) => {
          c.codName = `(${c.segCategory}) ${c.description}`;
        });
        this.categories = catalogs?.categories!;
        catalogs?.segments.forEach((s) => {
          s.codName = `(${s.segName}) ${s.descriptionShort}`;
        });
        this.segments = catalogs?.segments!;
        catalogs?.bodyworks.forEach((b) => {
          b.codName = `(${b.mercedesBodywork}) ${b.description}`;
        });
        this.bodyworks = catalogs?.bodyworks!;
        catalogs?.bodyStyles.forEach((b) => {
          b.codName = `(${b.mercedesBodyStyle}) ${b.description}`;
        });
       

        catalogs?.configurations.forEach((b) => {
          b.codName = `(${b.mercedesConfiguration}) ${b.description}`;
        });
        this.mercedesConfiguration = catalogs?.configurations!;
        catalogs?.configurations.forEach((b) => {
          b.codName = `(${b.mercedesConfiguration}) ${b.description}`;
        });


        this.bodyStyles = catalogs?.bodyStyles!;
        catalogs?.subsegments.forEach((b) => {
          b.codName = `(${b.mercedesSubsegment}) ${b.description}`;
        });
        this.subsegments = catalogs?.subsegments!;
        catalogs?.usages.forEach((b) => {
          b.codName = `(${b.mercedesUsage}) ${b.description}`;
        });
        this.usages = catalogs?.usages!;
        catalogs?.tractions.forEach((b) => {
          b.codName = `(${b.mercedesTraction}) ${b.description}`;
        });
        this.tractions = catalogs?.tractions!;
        catalogs?.gears?.forEach((b) => {
          b.codName = `(${b.mercedesGear}) ${b.description}`;
        });
        this.gears = catalogs?.gears!;
        catalogs?.fueltypes?.forEach((b) => {
          b.codName = `(${b.mercedesFuelType}) ${b.description}`;
        });
        
        this.fueltypes = catalogs?.fueltypes!;
        console.log("fueltypes!!!",this.fueltypes);
        catalogs?.cabinSDs?.forEach((b) => {
          b.codName = `(${b.mercedesCabinSD}) ${b.description}`;
        });
        this.cabinasSD = catalogs?.cabinSDs!;
        catalogs?.wheelbases?.forEach((b) => {
          b.codName = `(${b.mercedesWheelBase}) ${b.description}`;
        });
        this.wheelbases = catalogs?.wheelbases!;
        catalogs?.axlebases?.forEach((b) => {
          b.codName = `(${b.mercedesAxleBase}) ${b.description}`;
        });
        this.axlebases = catalogs?.axlebases!;
        catalogs?.powers.forEach((b) => {
          b.codName = `(${b.mercedesPower}) ${b.description}`;
        });
        this.powers = catalogs?.powers!;
        catalogs?.motorDTs?.forEach((b) => {
          b.codName = `(${b.mercedesMotorDT}) ${b.description}`;
        });
        this.motorDt = catalogs?.motorDTs!;
        catalogs?.mcgTotalMkts?.forEach((b) => {
          b.codName = `(${b.mercedesMCGTotalMkt}) ${b.description}`;
        });
        this.mCGTotalMkt = catalogs?.mcgTotalMkts!;
        catalogs?.doors?.forEach((b) => {
          b.codName = `(${b.mercedesDoor}) ${b.description}`;
        });
        this.doors = catalogs?.doors!;
        catalogs?.catRules?.forEach((b) => {
          b.codName = `(${b.mercedesCatRule}) ${b.description}`;
        });
        this.rule = catalogs?.catRules!;
        catalogs?.sources?.forEach((b) => {
          b.codName = `(${b.mercedesSource}) ${b.description}`;
        });
        this.source = catalogs?.sources!;
        catalogs?.pbts?.forEach((b) => {
          b.codName = `(${b.mercedesPBT}) ${b.description}`;
        });
        this.pbt = catalogs?.pbts!;
        catalogs?.pbttns?.forEach((b) => {
          b.codName = `(${b.mercedesPBTTN}) ${b.description}`;
        });
        this.pbtTn = catalogs?.pbttns!;
        catalogs?.altBodysts?.forEach((b) => {
          b.codName = `(${b.mercedesAltBodyst}) ${b.description}`;
        });
        this.altbodyst = catalogs?.altBodysts!;
        catalogs?.altCategs?.forEach((b) => {
          b.codName = `(${b.mercedesAltCateg}) ${b.description}`;
        });
        this.altcateg = catalogs?.altCategs!;
        catalogs?.altSegms?.forEach((b) => {
          b.codName = `(${b.mercedesAltSegm}) ${b.description}`;
        });
        this.altsegm = catalogs?.altSegms!;
        catalogs?.amgCompsets?.forEach((b) => {
          b.codName = `(${b.mercedesAMGCompSet}) ${b.description}`;
        });
        this.amgcompset = catalogs?.amgCompsets!;
        catalogs?.aperturesOne?.forEach((b) => {
          b.codName =`(${b.mercedesApertureOne}) ${b.descriptionShort}`;
        });
        this.apertura1 = catalogs?.aperturesOne!;
        catalogs?.aperturesTwo?.forEach((b) => {
          b.codName = `(${b.mercedesApertureTwo}) ${b.descriptionShort}`;
        });
        console.log("ivs apertura1",this.apertura1);
        
        this.apertura2 = catalogs?.aperturesTwo!;
        console.log("APERTURA 2", this.apertura2);
        
        catalogs?.aperturesThree?.forEach((b) => {
          b.codName = `(${b.mercedesApertureThree}) ${b.description}`;
        });
        this.apertura3 = catalogs?.aperturesThree!;
        catalogs?.aperturesFour?.forEach((b) => {
          b.codName = `(${b.mercedesApertureFour}) ${b.description}`;
        });
        this.apertura4 = catalogs?.aperturesFour!;
        catalogs?.cabinCFs?.forEach((b) => {
          b.codName = `(${b.mercedesCabinCF}) ${b.description}`;
        });
        this.cabinasCF = catalogs?.cabinCFs!;
        console.log("CabinaCF",this.cabinasCF);
        
        catalogs?.engineCapacitys?.forEach((b) => {
          b.codName = `(${b.mercedesEngineCapacity}) ${b.description}`;
        });
        this.engineCapacity = catalogs?.engineCapacitys!;
        catalogs?.cjdCompetitives?.forEach((b) => {
          b.codName = `(${b.mercedesCJDCompetitive}) ${b.description}`;
        });
        this.cJDCompetitive = catalogs?.cjdCompetitives!;
        catalogs?.competitiveCJDs?.forEach((b) => {
          b.codName = `(${b.mercedesCompetitiveCJD}) ${b.description}`;
        });
        this.competitiveCJD = catalogs?.competitiveCJDs!;
        catalogs?.groups?.forEach((b) => {
          b.codName = `(${b.mercedesGroup}) ${b.description}`;
        });
        this.group = catalogs?.groups!;
        catalogs?.nis?.forEach((b) => {
          b.codName = `(${b.mercedesNI}) ${b.description}`;
        });
        this.nI = catalogs?.nis!;
        catalogs?.relevMBs?.forEach((b) => {
          b.codName = `(${b.mercedesRelevMB}) ${b.description}`;
        });
        this.relevMb = catalogs?.relevMBs!;
        catalogs?.ssegms?.forEach((b) => {
          b.codName = `(${b.mercedesSSegm}) ${b.description}`;
        });
        this.ssegm = catalogs?.ssegms!;
        catalogs?.segmentationAux1s?.forEach((b) => {
          b.codName = `(${b.mercedesSegmentationAux1}) ${b.description}`;
        });
        this.segmentationAux1 = catalogs?.segmentationAux1s!;


        this.dataSource = new MatTableDataSource<any>(
          this.internalVersionSegmentations
        );
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
        const dialogRef = this.dialog.open(
          InternalVersionSegmentationDialogComponent,
          {
            // En caso de tener errores de que no muestra bien el fondo en los otros diálogos,
            // seguir el HTML del componente de este diálogo.
            // Tanto Large Screens como Responsive.
            // Hay que agregar la class BG en el Form y posiblemente poner el div de botones dentro del tag Form.
            width: '90%',
            height: '40%',
            maxHeight: '100%',
            disableClose: true,
            data: {
              internalVersionSegmentation: internalVersionSegmentationObject ? internalVersionSegmentationObject : uuidv4(),
              internalVersions: this.internalVersions,
              categories: this.categories,
              segments: this.segments,
              bodyworks: this.bodyworks,
              bodyStyles: this.bodyStyles,
              subsegments: this.subsegments,
              usages: this.usages,
              tractions: this.tractions,
              fueltypes:this.fueltypes,
              cabinasSD:this.cabinasSD,
              powers: this.powers,
              altBodysts:this.altbodyst,
              altCategs:this.altcateg,
              altSegms: this.altsegm,
              amgCompSets:this.amgcompset,
              aperturesOne:this.apertura1,
              aperturesTwo:this.apertura2,
              aperturesFour:this.apertura4,
              aperturesThree:this.apertura3,
              axlebases:this.axlebases,
              cabinSDs:this.cabinasSD,
              cabinCFs:this.cabinasCF,
              catRules:this.rule,
              cjdCompetitives:this.cJDCompetitive,
              competitiveCJDs:this.competitiveCJD,
              doors:this.doors,
              engineCapacitys:this.engineCapacity,
              gears:this.gears,
              groups:this.group,
              mcgTotalMkts:this.mCGTotalMkt,
              motorDTs:this.motorDt,
              nis:this.nI,
              pbts:this.pbt,
              pbttns:this.pbtTn,
              relevMBs:this.relevMb,
              segmentationAux1s:this.segmentationAux1,
              sources:this.source,
              ssegms:this.ssegm,
              wheelbases:this.wheelbases,
              mercedesConfiguration: this.mercedesConfiguration
            },
          }
        );
        dialogRef.afterClosed().subscribe((result) => {
          if(result) {
            this.getData();
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`category > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  confirmDelete(
    internalVersionSegmentationObject: InternalVersionSegmentation,
    callback?: any
  ) {
    const internalVersionSegmentation = `${
      internalVersionSegmentationObject.id ?? '-'
    }`;
    this.sweetAlert.question(
      'Eliminar',
      `¿Estás seguro/a que deseas eliminar la versión interna segmentación "${internalVersionSegmentation}"?`,
      'Sí, eliminar',
      'No',
      () => {
        this.delete(internalVersionSegmentationObject.id ?? '');
      }
    );
  }

  delete(internalVersionSegmentationId: string): void {
    this.internalVersionSegmentationService
      .deleteCache(internalVersionSegmentationId)
      .subscribe({
        next: () => {
          Toast.fire({
            icon: 'success',
            title: '¡Versión interna segmentación eliminada con éxito!',
          });
          this.getData();
        },
        error: (err) => {
          this.isLoading = false;
          console.error(`${this.TAG} > delete > error`, err);
          const error = ErrorHelper.getErrorMessage(err);
          this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
        },
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleFullscreen() {
    console.log(screenfull);

    if (!this.fullScreen.isEnabled) {
      this.fullScreen.isEnabled = true;
      if (!screenfull.isFullscreen) screenfull.toggle();
      this.getData();
      this.pageSize = 150;
      this.authService.onDrawerOpenedEmitter.emit(false);
      this.authService.onHeaderEmitter.emit(false);
    } else {
      this.fullScreen.isEnabled = false;
      this.getData();
      this.pageSize = 8;
      this.authService.onDrawerOpenedEmitter.emit(true);
      this.authService.onHeaderEmitter.emit(true);
      if (screenfull.isFullscreen) screenfull.toggle();
    }
  }
}
