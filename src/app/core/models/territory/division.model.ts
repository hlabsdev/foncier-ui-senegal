import { Selectable } from '@app/core/interfaces/selectable.interface';
import { Circle } from './circle.model';
import { Territory } from './territory.model';
import { Registry } from '@app/core/models/registry.model';

export class Division extends Territory implements Selectable {
  circleId: string;
  circle: Circle;
  registries: Registry[];
  registryNames: string;

  constructor(obj: any = {}) {
    super(obj);
    this.circle = obj.circle ? new Circle(obj.circle) : null;
    this.circleId = obj.circle ? obj.circle.id : obj.circleId;
    this.registries = obj.registries ? obj.registries.map(registry => new Registry(registry)) : [];
    this.registryNames = '';
  }
}
