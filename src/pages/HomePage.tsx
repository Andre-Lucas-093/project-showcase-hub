import { useState, useEffect, useMemo } from 'react';
import { api } from '@/services/api';
import { CourseSummary, Project } from '@/types';
import ProjectCard from '@/components/ProjectCard';
import ExtensionsCarousel from '@/components/ExtensionsCarousel';
import { HeroLanding } from '@/components/ui/hero-1';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const HomePage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([api.getProjects(), api.getCourses()])
      .then(([projectsResult, coursesResult]) => {
        if (projectsResult.status === 'fulfilled') {
          setProjects(projectsResult.value);
        }
        if (coursesResult.status === 'fulfilled') {
          setCourses(coursesResult.value);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCourseFilter('all');
  };

  const courseCategoryByName = useMemo(() => {
    const map = new Map<string, CourseSummary['categoria']>();
    for (const course of courses) {
      map.set(course.nome, course.categoria);
    }
    return map;
  }, [courses]);

  const availableCourses = useMemo(() => {
    if (statusFilter === 'all') return courses;

    return courses.filter(c => {
      let isMatch = false;
      if (statusFilter.startsWith('pos_graduacao')) {
        isMatch = c.categoria === 'pos_graduacao';
        if (isMatch && statusFilter !== 'pos_graduacao') {
          if (statusFilter === 'pos_graduacao_ead') isMatch = c.modalidade === 'ead';
          else if (statusFilter === 'pos_graduacao_presencial') isMatch = c.modalidade === 'presencial';
        }
      } else if (statusFilter.startsWith('graduacao')) {
        isMatch = c.categoria === 'graduacao';
        if (isMatch && statusFilter !== 'graduacao') {
          if (statusFilter === 'graduacao_ead') isMatch = c.modalidade === 'ead';
          else if (statusFilter === 'graduacao_hibrido') isMatch = c.modalidade === 'hibrido';
          else if (statusFilter === 'graduacao_presencial') isMatch = c.modalidade === 'presencial';
        }
      }
      return isMatch;
    });
  }, [courses, statusFilter]);

  const groupedCourses = useMemo(() => {
    const groups = new Map<string, CourseSummary[]>();
    for (const c of availableCourses) {
      let groupName = c.categoria === 'graduacao' ? 'Graduação' : 'Pós-Graduação';
      if (c.modalidade === 'presencial') groupName += ' - Presencial';
      else if (c.modalidade === 'ead') groupName += ' - EAD';
      else if (c.modalidade === 'hibrido') groupName += ' - Híbrido';

      if (!groups.has(groupName)) {
        groups.set(groupName, []);
      }
      groups.get(groupName)!.push(c);
    }
    return Array.from(groups.entries());
  }, [availableCourses]);

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchSearch = p.titulo.toLowerCase().includes(search.toLowerCase());
      const area = p.area ?? '';
      
      const category = area ? courseCategoryByName.get(area) : undefined;
      const courseObj = courses.find(c => c.nome === area);
      
      let matchStatus = false;
      if (statusFilter === 'all') {
        matchStatus = true;
      } else if (statusFilter.startsWith('pos_graduacao')) {
        matchStatus = category === 'pos_graduacao';
        if (matchStatus && courseObj && statusFilter !== 'pos_graduacao') {
           if (statusFilter === 'pos_graduacao_ead') matchStatus = courseObj.modalidade === 'ead';
           else if (statusFilter === 'pos_graduacao_presencial') matchStatus = courseObj.modalidade === 'presencial';
        }
      } else if (statusFilter.startsWith('graduacao')) {
        matchStatus = category === 'graduacao';
        if (matchStatus && courseObj && statusFilter !== 'graduacao') {
           if (statusFilter === 'graduacao_ead') matchStatus = courseObj.modalidade === 'ead';
           else if (statusFilter === 'graduacao_hibrido') matchStatus = courseObj.modalidade === 'hibrido';
           else if (statusFilter === 'graduacao_presencial') matchStatus = courseObj.modalidade === 'presencial';
        }
      }

      const matchCourse = courseFilter === 'all' || area === courseFilter;

      return matchSearch && matchStatus && matchCourse;
    });
  }, [projects, search, statusFilter, courseFilter, courseCategoryByName, courses]);

  return (
    <HeroLanding
      title="Projetos Acadêmicos"
      description="Explore projetos inovadores desenvolvidos pela comunidade acadêmica."
      gradientColors={{ from: 'white', to: '#10b981' }} // white and emerald green
      className="pb-20"
      logo={undefined}
      navigation={[]}
    >
      <div className="container px-0 sm:px-4">
        <ExtensionsCarousel />

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 mt-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-background/80 backdrop-blur-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-full sm:w-[260px] bg-background/80 backdrop-blur-sm">
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os níveis</SelectItem>
              
              <SelectSeparator />
              
              <SelectGroup>
                <SelectLabel>Graduação</SelectLabel>
                <SelectItem value="graduacao_presencial" className="pl-6">Presencial</SelectItem>
                <SelectItem value="graduacao_hibrido" className="pl-6">Híbrido</SelectItem>
                <SelectItem value="graduacao_ead" className="pl-6">EAD</SelectItem>
              </SelectGroup>

              <SelectSeparator />
              
              <SelectGroup>
                <SelectLabel>Pós-Graduação</SelectLabel>
                <SelectItem value="pos_graduacao_presencial" className="pl-6">Presencial</SelectItem>
                <SelectItem value="pos_graduacao_ead" className="pl-6">EAD</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={courseFilter} onValueChange={setCourseFilter} disabled={statusFilter === 'all' && courses.length === 0}>
            <SelectTrigger className="w-full sm:w-[260px] bg-background/80 backdrop-blur-sm">
              <SelectValue placeholder="Curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os cursos</SelectItem>
              {groupedCourses.map(([groupName, groupCourses]) => (
                <SelectGroup key={groupName}>
                  <SelectLabel className="text-primary font-bold">{groupName}</SelectLabel>
                  {groupCourses.map(course => (
                    <SelectItem key={course.nome} value={course.nome} className="pl-6">
                      {course.nome}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-40 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            Nenhum projeto encontrado.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <div key={p.projeto_id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </HeroLanding>
  );
};

export default HomePage;
